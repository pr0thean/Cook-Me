import { getCategories } from 'app/actions/getCategories'
import { getTags } from 'app/actions/getTags'
import { CategoryForm } from 'features/admin/components/CategoryForm'
import { RecipeForm } from 'features/admin/components/RecipeForm'
import { RecipesList } from 'features/admin/components/RecipesList'
import { TagForm } from 'features/admin/components/TagForm'
import { SignOutButton } from 'features/login/SignOutButton'
import { requireAdmin } from 'lib/auth'

export default async function AdminPage() {
  await requireAdmin()

  const categories = await getCategories()
  const tags = await getTags()

  return (
    <div className="mt-20 space-y-4 text-white">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Admin Page</h1>

        <SignOutButton />
      </div>

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
