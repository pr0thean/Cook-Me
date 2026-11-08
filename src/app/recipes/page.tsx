import { Suspense } from 'react'
import { Hero } from '@/components/molecules/Hero'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import { FiltersContainer } from '@/features/recipes/components/FiltersContainer'
import { RecipesListInfinite } from '@/features/recipes/components/RecipesListInfinite'

export default function RecipesPage() {
  return (
    <div>
      <Hero heading="List of all recipes" imageUrl="/assets/images/all-recipes.jpeg" />

      <div className="mt-6 md:mt-8">
        {/* Filters reads useSearchParams, so it needs its own boundary */}
        <Suspense>
          <FiltersContainer />
        </Suspense>
      </div>

      <div className="mt-8 md:mt-10">
        <Suspense fallback={<SkeletonLoader type="recipes-list" />}>
          <RecipesListInfinite />
        </Suspense>
      </div>
    </div>
  )
}
