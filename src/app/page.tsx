import CategoriesList from '@app/components/categories-list'
import { getPage } from '@services/getPage'
import Hero from '@app/components/hero'
import Content from '@app/components/content'

export default async function Home() {
  const page = await getPage('home')
  const { hero, sections } = page

  return (
    <div className="space-y-4 pb-4 md:space-y-6 md:pb-6">
      {hero && <Hero image={hero.fields.image} heading={hero.fields.heading} />}

      <CategoriesList />

      {sections && <Content contentBody={sections} />}
    </div>
  )
}
