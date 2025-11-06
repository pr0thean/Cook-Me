import { serverClient } from './supabase/serverClient'

export function getRecipeImageUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/recipes-images/${path}`
}

export async function uploadRecipeImage(file: File, recipeId: string) {
  const supabase = await serverClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${recipeId}-${Date.now()}.${fileExt}`
  const filePath = `recipes/${fileName}`

  // Upload file
  const { data, error } = await supabase.storage.from('recipes-images').upload(filePath, file)

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('recipes-images').getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicUrl,
  }
}

export async function deleteRecipeImage(path: string) {
  const supabase = await serverClient()

  const { error } = await supabase.storage.from('recipes-images').remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}
