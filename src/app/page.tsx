import { CategoriesList } from 'features/categories/components/CategoriesList'
import { Hero } from 'components/molecules/Hero'
import { GuidedTour } from 'features/guided-tour/GuidedTour'
import { Button } from 'components/atoms/button'
import Statistics from 'features/statistics/components/Statistics'

export default async function Home() {
  return (
    <div className="space-y-6 pb-4 md:space-y-8 md:pb-6">
      <Hero heading="Cook Me" imageUrl="/assets/images/landing-page.png" />

      <div className="space-y-4 px-4 sm:px-6 md:space-y-6">
        <CategoriesList />
      </div>

      <div className="mx-4 mt-10 mb-10 sm:mx-auto sm:w-1/2">
        <Button label=">> Browse all recipes <<" link="/recipes" className="shadow-lg" />
      </div>

      <div className="space-y-6 px-4 sm:px-6 md:space-y-10">
        <Statistics />
      </div>

      <GuidedTour />
    </div>
  )
}
