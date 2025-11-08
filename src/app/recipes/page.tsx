import Hero from '@components/molecules/hero'
import RecipesList from '@features/recipes/components/recipes-list'
import { FiltersContainer } from '@components/molecules/filters-container'
import { getRecipes } from '@app/actions/getRecipes'
import { SearchParams } from '@typings/page-params'

export default async function RecipesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const { search, level, category, tag } = searchParams
  const recipes = await getRecipes()

  return (
    <div>
      <Hero image={undefined} heading="Hero heading" />

      <div className="mt-6 md:mt-8">
        <FiltersContainer />
      </div>

      <div className="mt-8 md:mt-10">
        {recipes.length === 0 ? (
          <div className="text-center text-yellow">No recipes found</div>
        ) : (
          <RecipesList recipes={recipes} />
        )}
      </div>
    </div>
  )
}
