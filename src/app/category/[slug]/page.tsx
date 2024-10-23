import Hero from '@components/molecules/hero'
import RecipesList from '@features/recipes/components/recipes-list'
import { getCategories } from '@features/categories/operations/get-categories'
import { getRecipesByCategory } from '@features/recipes/operations/get-recipes-by-category'
import { PageParams } from '@typings/page-params'

export default async function CategoryPage({ params }: PageParams) {
  const categories = await getCategories(params.slug)
  const recipes = await getRecipesByCategory(params.slug)

  if (recipes.isErr()) {
    throw new Error('Failed to load recipes')
  }

  let hero

  if (categories.isOk() && categories.value) {
    hero = {
      image: categories.value[0].image,
      heading: categories.value[0].title,
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {hero && <Hero image={hero.image} heading={hero.heading} />}

      {!recipes.value ? (
        <div className="text-center text-yellow">No recipes found</div>
      ) : (
        <RecipesList recipes={recipes.value} />
      )}
    </div>
  )
}
