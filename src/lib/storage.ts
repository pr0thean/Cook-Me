import 'server-only'
import { adminClient } from './supabase/adminClient'

type Bucket = 'recipes-images' | 'categories-images' | 'post-images'

export function getImageUrl(path: string, bucket: Bucket) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export async function uploadImage(file: File, sourceId: string, bucket: Bucket) {
  const supabase = adminClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${sourceId}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload file
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file)

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicUrl,
  }
}

export async function deleteImage(path: string, bucket: Bucket) {
  const supabase = adminClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/** Uploads a file to an exact path (fails if something is already there) */
export async function uploadFileAt(path: string, file: Blob, bucket: Bucket, contentType: string) {
  const { error } = await adminClient().storage.from(bucket).upload(path, file, { contentType })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
}

/** Deletes many files at once. Paths that don't exist are ignored by Supabase. */
export async function deleteFiles(paths: string[], bucket: Bucket) {
  if (paths.length === 0) return

  const supabase = adminClient()
  const batchSize = 1000 // Supabase's limit per request

  for (let i = 0; i < paths.length; i += batchSize) {
    const { error } = await supabase.storage.from(bucket).remove(paths.slice(i, i + batchSize))

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  }
}
