import { serverClient } from './supabase/serverClient'

type Bucket = 'recipes-images' | 'categories-images'

export function getImageUrl(path: string, bucket: Bucket) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export async function uploadImage(file: File, sourceId: string, bucket: Bucket) {
  const supabase = await serverClient()

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
  const supabase = await serverClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}
