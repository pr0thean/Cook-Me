import { Hero } from '@/components/molecules/Hero'
import { FiltersContainer } from '@/features/recipes/components/FiltersContainer'
import { RecipesListInfinite } from '@/features/recipes/components/RecipesListInfinite'

export default async function RecipesPage() {
  return (
    <div>
      <Hero heading="List of all recipes" imageUrl="/assets/images/all-recipes.jpeg" />

      <div className="mt-6 md:mt-8">
        <FiltersContainer />
      </div>

      <div className="mt-8 md:mt-10">
        <RecipesListInfinite />
      </div>
    </div>
  )
}
