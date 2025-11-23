import { Hero } from 'components/molecules/Hero'
import { RecipesList } from 'features/recipes/components/RecipesList'
import { FiltersContainer } from 'features/recipes/components/FiltersContainer'
import { getRecipes } from 'app/actions/getRecipes'
import { SearchParams } from 'types/page-params'

export default async function RecipesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const recipes = await getRecipes(searchParams)

  return (
    <div>
      <Hero heading="List of all recipes" imageUrl="/assets/images/all-recipes.jpeg" />

      <div className="mt-6 md:mt-8">
        <FiltersContainer />
      </div>

      <div className="mt-8 md:mt-10">
        {recipes.length === 0 ? (
          <div className="text-yellow text-center">No recipes found</div>
        ) : (
          <RecipesList recipes={recipes} />
        )}
      </div>
    </div>
  )
}
