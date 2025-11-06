import Hero from '@components/molecules/hero'
import RecipesList from '@features/recipes/components/recipes-list'
import { PageParams } from '@typings/page-params'

export default async function CategoryPage({ params }: PageParams) {
  // const category = await getCategory(params.slug)
  // const recipes = await getRecipesByCategory(params.slug)

  console.log('slug', params.slug)
  const recipes = []

  return (
    <div className="space-y-4 md:space-y-6">
      <Hero image={undefined} heading="Hero Heading" />

      {recipes.length === 0 ? (
        <div className="text-center text-yellow">No recipes found</div>
      ) : (
        <RecipesList recipes={[]} />
      )}
    </div>
  )
}
