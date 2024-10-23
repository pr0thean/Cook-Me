import Hero from '@components/molecules/hero'
import { getPage } from '@features/pages/operations/get-page'
import { getRecipes } from '@features/recipes/operations/get-recipes'
import RecipesList from '@features/recipes/components/recipes-list'
import { FiltersContainer } from '@components/molecules/filters-container'

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page = await getPage('recipes')
  const { search, level, category, tag } = searchParams
  const recipes = await getRecipes(search, level, category, tag)

  if (recipes.isErr()) {
    throw new Error('Failed to load recipes')
  }

  let hero

  if (page.isOk() && page.value) {
    hero = page.value[0].hero
  }

  return (
    <div>
      {hero && <Hero image={hero.image} heading={hero.heading} />}

      <div className="mt-6 md:mt-8">
        <FiltersContainer />
      </div>

      <div className="mt-8 md:mt-10">
        {!recipes.value ? (
          <div className="text-center text-yellow">No recipes found</div>
        ) : (
          <RecipesList recipes={recipes.value} />
        )}
      </div>
    </div>
  )
}
