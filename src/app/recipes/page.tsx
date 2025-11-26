import { Hero } from '@/components/molecules/Hero'
import { FiltersContainer } from '@/features/recipes/components/FiltersContainer'
import { getRecipes } from '@/app/actions/getRecipes'
import { SearchParams } from '@/types/page-params'
import { RecipesListInfinite } from '@/features/recipes/components/RecipesListInfinite'

const RECIPES_PER_PAGE = 10

export default async function RecipesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  const { recipes, nextCursor } = await getRecipes({
    searchParams: {
      search: searchParams.search,
      difficulty: searchParams.difficulty,
      category: searchParams.category,
      tag: searchParams.tag,
    },
    take: RECIPES_PER_PAGE,
  })

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
          <RecipesListInfinite initialRecipes={recipes} initialCursor={nextCursor} />
        )}
      </div>
    </div>
  )
}
