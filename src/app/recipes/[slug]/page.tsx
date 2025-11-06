import { PageParams } from '@typings/page-params'
import { Level } from '@features/recipes/components/level'
import { Time } from '@features/recipes/components/time'

import dynamic from 'next/dynamic'
import { getRecipes } from '@app/actions/getRecipes'
import ContentfulImage from '@components/atoms/contentful-image'

const CheapTip = dynamic(() => import('@features/guided-tour/components/cheap-tip'), {
  ssr: false,
})

// export async function generateStaticParams() {
//   const slugs = await getRecipesSlugs()

//   if (slugs.isErr() || !slugs.value) {
//     return []
//   }

//   return slugs.value.map((slug) => ({
//     slug,
//   }))
// }

export default async function RecipePage({ params }: PageParams) {
  const recipes = await getRecipes() // params.slug

  const { imageUrl, title, difficulty, time } = recipes[0]
  const tags = [{ name: 'Cheap' }]

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <div className="relative h-screen bg-black">
      {/* Image container */}
      <div className="absolute top-0 h-3/5 w-full">
        {imageUrl && <ContentfulImage alt={title} src={imageUrl} priority />}

        {/* Custom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex justify-center">
        <div className="page-content-shadow mt-[300px] w-11/12 space-y-4 rounded-t-xl bg-white p-5 text-black md:space-y-6 md:p-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">{title}</h1>
            {isCheap && <CheapTip />}
          </div>

          <div className="flex justify-between font-semibold">
            {difficulty && (
              <div>
                <div className="text-xs uppercase text-blue-gray-dark">Difficulty:</div>
                <Level level={difficulty} />
              </div>
            )}
            {time && (
              <div>
                <div className="text-xs uppercase text-blue-gray-dark">Time:</div>
                <Time time={time} />
              </div>
            )}
          </div>

          <div className="contentful-document">ingredients</div>

          <div className="contentful-document">instruction</div>
        </div>
      </div>
    </div>
  )
}
