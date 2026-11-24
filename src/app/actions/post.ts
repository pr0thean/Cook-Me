'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { prismaClient } from '@/lib/prismaClient'
import { uploadFileAt } from '@/lib/storage'
import { deletePostImageFiles, getPostImagePaths, revalidatePostPages } from '@/lib/posts'
import {
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGE_MAX_BYTES,
  POST_IMAGE_TYPES,
  POST_MAX_IMAGES,
  type PostActionResult,
} from '@/features/posts/types'

const SIGNED_OUT_ERROR = 'Your session has expired. Please sign in again.'
const NOT_APPROVED_ERROR = 'Your account needs to be approved before you can comment.'
const NOT_FOUND_ERROR = 'This comment no longer exists. Refresh the page.'

const POSTS_PER_HOUR_LIMIT = 10
const MAX_IMAGE_DIMENSION = 4096

type ImageType = (typeof POST_IMAGE_TYPES)[number]

const EXTENSIONS: Record<ImageType, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg' }

function fail(error: string): PostActionResult {
  return { success: false, error }
}

/**
 * Trims the text and normalises line breaks (forms send `\r\n`, which would count twice toward
 * the limit). Empty text becomes `null`.
 */
function normalizeContent(value: FormDataEntryValue | null) {
  const content = typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : ''

  return content || null
}

/** Checks the file's first bytes, since the MIME type sent by the browser can't be trusted */
async function hasImageSignature(file: File, type: ImageType) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to))

  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff

  return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
}

function isValidDimension(value: number) {
  return Number.isInteger(value) && value > 0 && value <= MAX_IMAGE_DIMENSION
}

type ParsedImage = { file: File; type: ImageType; width: number; height: number }

/**
 * Reads and validates the photos of a new post. The browser has already resized and re-encoded them,
 * and sends each one's size in `widths`/`heights`.
 */
async function parseImages(formData: FormData): Promise<ParsedImage[] | { error: string }> {
  const files = formData.getAll('images').filter((entry) => entry instanceof File && entry.size > 0)
  const widths = formData.getAll('widths').map(Number)
  const heights = formData.getAll('heights').map(Number)

  if (files.length > POST_MAX_IMAGES) {
    return { error: `You can add up to ${POST_MAX_IMAGES} photos.` }
  }

  const images: ParsedImage[] = []

  for (const [index, file] of (files as File[]).entries()) {
    const type = file.type as ImageType

    if (!POST_IMAGE_TYPES.includes(type) || !(await hasImageSignature(file, type))) {
      return { error: 'Photos must be JPG or WebP images.' }
    }

    if (file.size > POST_IMAGE_MAX_BYTES) {
      return { error: 'One of the photos is too large.' }
    }

    const width = widths[index]
    const height = heights[index]

    if (!isValidDimension(width) || !isValidDimension(height)) {
      return { error: 'One of the photos could not be processed.' }
    }

    images.push({ file, type, width, height })
  }

  return images
}

/**
 * Creates a post under a recipe (approved users only).
 * Write order: post row → files → image rows; any failure removes the post and the uploaded files.
 */
export async function createPost(formData: FormData): Promise<PostActionResult> {
  const user = await getCurrentUser()

  if (!user) return fail(SIGNED_OUT_ERROR)
  if (user.status !== 'APPROVED') return fail(NOT_APPROVED_ERROR)

  const recipeId = Number(formData.get('recipeId'))
  const content = normalizeContent(formData.get('content'))
  const images = await parseImages(formData)

  if ('error' in images) return fail(images.error)
  if (!content && images.length === 0) return fail('Write something or add a photo.')

  if (content && content.length > POST_CONTENT_MAX_LENGTH) {
    return fail(`Please keep it under ${POST_CONTENT_MAX_LENGTH} characters.`)
  }

  const recentPosts = await prismaClient.post.count({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
  })

  if (recentPosts >= POSTS_PER_HOUR_LIMIT) {
    return fail("You've commented a lot in the last hour. Please try again a bit later.")
  }

  const recipe = Number.isInteger(recipeId)
    ? await prismaClient.recipe.findUnique({ where: { id: recipeId }, select: { slug: true } })
    : null

  if (!recipe) return fail('This recipe no longer exists.')

  const post = await prismaClient.post.create({
    data: { recipeId, userId: user.id, content },
    select: { id: true, createdAt: true },
  })

  const paths = images.map(
    ({ type }, index) => `${recipeId}/${post.id}/${index}.${EXTENSIONS[type]}`
  )

  try {
    const uploads = await Promise.allSettled(
      images.map(({ file, type }, index) => uploadFileAt(paths[index], file, 'post-images', type))
    )
    const failedUpload = uploads.find((upload) => upload.status === 'rejected')

    if (failedUpload) throw failedUpload.reason

    await prismaClient.postImage.createMany({
      data: images.map(({ width, height }, index) => ({
        postId: post.id,
        recipeId,
        position: index,
        path: paths[index],
        width,
        height,
        createdAt: post.createdAt, // same timestamp as the post, so photo feeds sort like posts
      })),
    })
  } catch (error) {
    console.error('Creating post failed, rolling back:', error)

    // Image rows (if any) go with the post through the cascade
    await prismaClient.post.delete({ where: { id: post.id } }).catch((deleteError) => {
      console.error('Rollback of post failed:', post.id, deleteError)
    })
    await deletePostImageFiles(paths) // paths that were never uploaded are ignored

    return fail('Could not upload your photos. Please try again.')
  }

  revalidatePostPages([recipe.slug])

  return { success: true }
}

/** Changes the text of the user's own post. Photos can't be changed. */
export async function editPost(postId: number, rawContent: string): Promise<PostActionResult> {
  const user = await getCurrentUser()

  if (!user) return fail(SIGNED_OUT_ERROR)
  if (user.status !== 'APPROVED') return fail(NOT_APPROVED_ERROR)

  const post = await prismaClient.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
      content: true,
      recipe: { select: { slug: true } },
      _count: { select: { images: true } },
    },
  })

  if (!post) return fail(NOT_FOUND_ERROR)
  if (post.userId !== user.id) return fail('You can only edit your own comments.')

  const content = normalizeContent(rawContent)

  if (content && content.length > POST_CONTENT_MAX_LENGTH) {
    return fail(`Please keep it under ${POST_CONTENT_MAX_LENGTH} characters.`)
  }

  if (!content && post._count.images === 0) {
    return fail('A comment without photos needs some text. Delete the comment instead.')
  }

  if (content === post.content) return { success: true }

  await prismaClient.post.update({
    where: { id: postId },
    data: { content, editedAt: new Date() },
  })

  revalidatePostPages([post.recipe.slug])
  revalidatePath('/admin/posts')

  return { success: true }
}

/** Deletes a post and its photos. Allowed for the author and the admin. */
export async function deletePost(postId: number): Promise<PostActionResult> {
  const user = await getCurrentUser()

  if (!user) return fail(SIGNED_OUT_ERROR)

  const post = await prismaClient.post.findUnique({
    where: { id: postId },
    select: { userId: true, recipe: { select: { slug: true } } },
  })

  if (!post) return fail(NOT_FOUND_ERROR)

  if (post.userId !== user.id && user.role !== 'ADMIN') {
    return fail('You can only delete your own comments.')
  }

  // Read before the cascade removes the rows
  const imagePaths = await getPostImagePaths({ postId })

  await prismaClient.post.delete({ where: { id: postId } })
  await deletePostImageFiles(imagePaths)

  revalidatePostPages([post.recipe.slug])
  revalidatePath('/admin/posts')

  return { success: true }
}
