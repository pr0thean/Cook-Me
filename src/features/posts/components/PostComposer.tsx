'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { createPost } from '@/app/actions/post'
import { Spinner } from '@/components/atoms/Spinner'
import { useViewer } from '@/features/auth/viewer'
import { authUrl } from '@/utils/auth-redirect'
import { compressImage, UnsupportedImageError, type CompressedImage } from '../compressImage'
import { POST_CONTENT_MAX_LENGTH, POST_MAX_IMAGES } from '../types'
import { useRefreshPosts } from '../usePosts'

type Props = {
  recipeId: number
  recipeSlug: string
}

type SelectedPhoto = CompressedImage & { key: string; previewUrl: string }

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif'

/**
 * "Share your version" form. What it shows depends on the viewer (read on the client, so the
 * cached page stays the same for everyone): a sign-in prompt, a disabled form while awaiting
 * approval, the form itself, or nothing for banned users.
 */
export function PostComposer({ recipeId, recipeSlug }: Props) {
  const { data: viewer, isPending: isViewerLoading } = useViewer()

  if (isViewerLoading) return null

  if (!viewer) {
    return (
      <p className="bg-gray-lighter rounded-md px-5 py-4">
        Cooked it?{' '}
        <Link
          href={authUrl(`/recipes/${recipeSlug}`)}
          className="text-orange-dark font-semibold underline"
        >
          Sign in to share your version
        </Link>
        .
      </p>
    )
  }

  if (viewer.status === 'BANNED') return null

  return <ComposerForm recipeId={recipeId} disabled={viewer.status === 'PENDING'} />
}

function ComposerForm({ recipeId, disabled }: { recipeId: number; disabled: boolean }) {
  const refreshPosts = useRefreshPosts(recipeId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>()
  const [isSubmitting, startSubmit] = useTransition()

  // Free the preview URLs when the form goes away
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  })
  useEffect(
    () => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)),
    []
  )

  const remainingSlots = POST_MAX_IMAGES - photos.length
  const isBusy = disabled || isProcessing || isSubmitting
  const canSubmit = !isBusy && (content.trim().length > 0 || photos.length > 0)

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, remainingSlots)
    event.target.value = '' // allow picking the same file again after removing it

    if (files.length === 0) return

    setError(undefined)
    setIsProcessing(true)

    const added: SelectedPhoto[] = []
    const failed: string[] = []

    for (const file of files) {
      try {
        const compressed = await compressImage(file)

        added.push({
          ...compressed,
          key: crypto.randomUUID(),
          previewUrl: URL.createObjectURL(compressed.file),
        })
      } catch (compressError) {
        if (!(compressError instanceof UnsupportedImageError)) console.error(compressError)
        failed.push(file.name)
      }
    }

    setPhotos((current) => [...current, ...added])
    setIsProcessing(false)

    if (failed.length > 0) {
      setError(`Couldn't read ${failed.join(', ')}. Please use JPG or PNG.`)
    }
  }

  const removePhoto = (key: string) => {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.key === key)
      if (removed) URL.revokeObjectURL(removed.previewUrl)

      return current.filter((photo) => photo.key !== key)
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    const formData = new FormData()
    formData.set('recipeId', String(recipeId))
    formData.set('content', content)

    for (const photo of photos) {
      formData.append('images', photo.file)
      formData.append('widths', String(photo.width))
      formData.append('heights', String(photo.height))
    }

    setError(undefined)
    startSubmit(async () => {
      try {
        const result = await createPost(formData)

        if (!result.success) {
          setError(result.error)
          return
        }
      } catch (submitError) {
        console.error('Posting failed:', submitError)
        setError('Could not post your comment. Check your connection and try again.')
        return
      }

      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
      setPhotos([])
      setContent('')
      await refreshPosts()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {disabled && (
        <p
          role="status"
          className="bg-yellow/20 border-yellow rounded-md border-l-4 px-5 py-4 text-sm"
        >
          Your account is awaiting approval. You&apos;ll be able to comment as soon as it&apos;s
          approved.
        </p>
      )}

      <fieldset disabled={disabled} className="space-y-3 disabled:opacity-60">
        <label htmlFor="post-content" className="sr-only">
          Your notes
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={POST_CONTENT_MAX_LENGTH}
          rows={3}
          placeholder="How did it go? Any changes you made?"
          className="border-gray w-full rounded-sm border bg-white px-4 py-2 text-base text-black focus:outline-hidden disabled:cursor-not-allowed"
        />

        {photos.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {photos.map((photo) => (
              <li key={photo.key} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={photo.previewUrl} alt="" className="h-24 w-24 rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.key)}
                  disabled={isSubmitting}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/70 p-0.5 text-white hover:bg-black"
                >
                  <XMarkIcon className="h-4 w-4" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy || remainingSlots === 0}
              className="border-gray hover:bg-gray-lighter flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? <Spinner /> : <PhotoIcon className="h-5 w-5" />}
              Add photos ({photos.length}/{POST_MAX_IMAGES})
            </button>

            <span className="text-blue-gray text-xs">
              {content.length}/{POST_CONTENT_MAX_LENGTH}
            </span>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-orange hover:bg-orange-dark text-off-black flex cursor-pointer items-center gap-2 rounded-sm px-5 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        <p className="text-blue-gray text-xs">
          Comments and photos are public. Your display name is shown next to your comment.
        </p>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}
