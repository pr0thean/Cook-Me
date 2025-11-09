import { getCategoryBySlug } from '@app/actions/getCategoryBySlug'
import Hero from '@components/molecules/hero'
import { RecipesList } from '@features/recipes/components/RecipesList'
import { PageParams } from '@typings/page-params'

export default async function CategoryPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    throw new Error('Category not found')
  }

  const recipes = category?.recipes || []

  return (
    <div className="space-y-4 md:space-y-6">
      <Hero heading={category?.name} imageUrl={category?.imageUrl || undefined} />

      {recipes.length === 0 ? (
        <div className="text-yellow text-center">No recipes found</div>
      ) : (
        <RecipesList recipes={recipes} />
      )}
    </div>
  )
}
