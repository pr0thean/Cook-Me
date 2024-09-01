import ContentfulImage from '@app/components/atoms/contentful-image'
import { PageParams } from '@typings/PageParams'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getRecipe } from '@services/getRecipe'
import { Level } from '@app/components/atoms/level'
import { Time } from '@app/components/atoms/time'
import { PercentBadgeIcon } from '@heroicons/react/24/outline'

export default async function RecipePage({ params }: PageParams) {
  const recipe = await getRecipe(params.slug)

  if (recipe.isErr() || !recipe.value) {
    throw new Error('Recipe not found')
  }

  const { time, level, image, name, ingredients, instruction, tags } = recipe.value[0]

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <div className="relative h-screen bg-black">
      {/* Image container */}
      <div className="absolute top-0 h-3/5 w-full">
        {image && <ContentfulImage alt={image.title} src={image.url} priority />}

        {/* Custom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex justify-center">
        <div className="page-content-shadow mt-[300px] w-11/12 space-y-4 rounded-t-xl bg-white p-5 text-black md:space-y-6 md:p-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">{name}</h1>
            {isCheap && <PercentBadgeIcon width={30} fill={'#FF652F'} />}
          </div>

          <div className="flex justify-between font-semibold">
            {level && (
              <div>
                <div className="text-xs uppercase text-blue-gray-dark">Level:</div>
                <Level level={level} />
              </div>
            )}
            {time && (
              <div>
                <div className="text-xs uppercase text-blue-gray-dark">Time:</div>
                <Time time={time} />
              </div>
            )}
          </div>

          <div className="contentful-document">{documentToReactComponents(ingredients.json)}</div>

          <div className="contentful-document">{documentToReactComponents(instruction.json)}</div>
        </div>
      </div>
    </div>
  )
}
