import { CategoriesList } from 'features/categories/components/CategoriesList'
import { Hero } from 'components/molecules/Hero'
import { GuidedTour } from 'features/guided-tour/GuidedTour'
import { Button } from 'components/atoms/button'

export default async function Home() {
  return (
    <div className="space-y-4 pb-4 md:space-y-6 md:pb-6">
      <Hero heading="Cook Me" imageUrl="/assets/images/landing-page.png" />

      <CategoriesList />

      <div className="mx-auto mt-8 w-fit sm:w-1/2">
        <Button label="Browse all recipes" link="/recipes" />
      </div>

      <GuidedTour />
    </div>
  )
}
