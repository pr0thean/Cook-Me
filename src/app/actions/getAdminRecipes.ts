'use server'

import { requireAdmin } from '@/lib/auth'
import { getRecipes } from '@/lib/data/recipes'

// TODO: temporary — remove with the admin page redesign (fetch on the server instead)
export async function getAdminRecipes() {
  await requireAdmin()

  return getRecipes()
}
