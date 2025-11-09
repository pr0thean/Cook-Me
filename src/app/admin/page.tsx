import { getCategories } from '@app/actions/getCategories'
import { getRecipes } from '@app/actions/getRecipes'
import { CategoryForm } from '@features/admin/components/CategoryForm'
import { RecipeForm } from '@features/admin/components/RecipeForm'
import Image from 'next/image'

export default async function AdminPage() {
  const recipes = await getRecipes()
  const categories = await getCategories()

  console.log(categories)
  console.log(recipes)

  return (
    <div className="mt-20 space-y-4 text-white">
      <h1 className="text-xl">Admin Page</h1>

      <div className="flex gap-4">
        <div className="w-2/3">
          <h2 className="text-lg">Create Recipe</h2>

          <RecipeForm categories={categories} />
        </div>

        <div className="w-1/3">
          <h2 className="text-lg">Create Category</h2>

          <CategoryForm />
        </div>
      </div>

      <div>
        <h2 className="text-lg">Recipes</h2>

        <div className="space-y-4 p-4">
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <div className="flex items-center gap-3">
                {recipe.imageUrl && (
                  <Image src={recipe.imageUrl} width={30} height={30} alt="recipe image" />
                )}
                <span>{recipe.title}</span>
              </div>
              <p className="text-xs">{recipe.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
