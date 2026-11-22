import { getCategories } from '@/lib/data/categories'
import { getTags } from '@/lib/data/tags'
import { CategoryForm } from '@/features/admin/components/CategoryForm'
import { RecipeForm } from '@/features/admin/components/RecipeForm'
import { RecipesList } from '@/features/admin/components/RecipesList'
import { TagForm } from '@/features/admin/components/TagForm'
import { requireAdmin } from '@/lib/auth'

export default async function AdminRecipesPage() {
  await requireAdmin('/admin/recipes')

  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-2/3">
          <h2 className="mb-2 text-lg font-semibold">Create Recipe</h2>

          <RecipeForm categories={categories} tags={tags} />
        </div>

        <div className="w-1/3">
          <h2 className="mb-2 text-lg font-semibold">Create Category</h2>

          <CategoryForm />

          <h2 className="mt-4 mb-2 text-lg font-semibold">Create Tag</h2>

          <TagForm />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Recipes</h2>

        <RecipesList />
      </div>
    </div>
  )
}
