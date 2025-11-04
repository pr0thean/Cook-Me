import { getRecipes } from '@app/actions/getRecipes'

export default async function AdminPage() {
  const recipes = await getRecipes()

  console.log(recipes)

  return (
    <div className="mt-20">
      <h1>Admin Page</h1>

      <div>
        <h2>Recipes</h2>

        <div>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              {recipe.title} - {recipe.category?.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
