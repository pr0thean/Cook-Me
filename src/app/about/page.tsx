import Hero from '@app/components/molecules/hero'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getPage } from '@services/getPage'
import { isTextBlock } from '@utils/isTextBlock'

export default async function AboutPage() {
  const page = await getPage('about')

  let hero
  let textBlock

  if (page.isOk() && page.value) {
    hero = page.value[0].hero

    if (isTextBlock(page.value[0].sectionsCollection.items[0])) {
      textBlock = page.value[0].sectionsCollection.items[0]
    }
  }

  return (
    <div>
      {hero && <Hero image={hero.image} heading={hero.heading} />}
      {textBlock && (
        <div className="page-content-shadow mx-auto mt-6 w-11/12 rounded-xl bg-white p-5 text-black md:p-10">
          <div className="contentful-document">
            {documentToReactComponents(textBlock.content.json)}
          </div>
        </div>
      )}
    </div>
  )
}
