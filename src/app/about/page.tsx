import Hero from '@app/components/molecules/hero'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getPage } from '@services/getPage'
import { isTextBlock } from '@utils/isTextBlock'

export default async function AboutPage() {
  const pageResult = await getPage('about')

  return pageResult.match(
    (page) => {
      const hero = page[0].hero

      const textBlock = isTextBlock(page[0].sectionsCollection.items[0])
        ? page[0].sectionsCollection.items[0]
        : null

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
    },
    (error) => <div>Error: {error.message}</div>
  )
}
