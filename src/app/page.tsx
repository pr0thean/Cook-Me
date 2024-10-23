import CategoriesList from '@features/categories/components/categories-list'
import { getPage } from '@features/pages/operations/get-page'
import Hero from '@components/molecules/hero'
import Content from '@components/layout/content'
import dynamic from 'next/dynamic'

const GuidedTour = dynamic(() => import('@features/guided-tour/guided-tour'), {
  ssr: false,
})

export default async function Home() {
  const page = await getPage('home')

  if (page.isErr() || !page.value) {
    throw new Error('Failed to load page')
  }

  const { hero, sectionsCollection } = page.value[0]

  const contentItems = sectionsCollection.items

  return (
    <div className="space-y-4 pb-4 md:space-y-6 md:pb-6">
      {hero && <Hero image={hero.image} heading={hero.heading} />}

      <CategoriesList />

      {contentItems?.length && <Content contentBody={contentItems} />}

      <GuidedTour />
    </div>
  )
}
