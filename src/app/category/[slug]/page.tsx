import Hero from '@app/components/hero'
import RecipesList from '@app/components/recipes-list'
import { getCategories } from '@services/getCategories'
import { getRecipesByCategory } from '@services/getRecipesByCategory'
import { PageParams } from '@typings/PageParams'

export default async function CategoryPage({ params }: PageParams) {
  const category = await getCategories(params.slug)
  const recipes = await getRecipesByCategory(params.slug)

  return (
    <div className="space-y-4 md:space-y-6">
      <Hero image={category.image} heading={category.title} />

      <RecipesList recipes={recipes} />
    </div>
  )
}
