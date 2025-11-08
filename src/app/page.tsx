import CategoriesList from '@features/categories/components/categories-list'
import Hero from '@components/molecules/hero'
import GuidedTour from '@features/guided-tour/guided-tour'

export default async function Home() {
  return (
    <div className="space-y-4 pb-4 md:space-y-6 md:pb-6">
      <Hero image={undefined} heading="Hero Heading" />

      <CategoriesList />

      <GuidedTour />
    </div>
  )
}
