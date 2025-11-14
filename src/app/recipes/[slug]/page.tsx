import { PageParams } from '@typings/page-params'
import { Level } from '@features/recipes/components/level'
import { Time } from '@features/recipes/components/time'

import { CheapTip } from '@features/guided-tour/components/CheapTip'
import { getRecipeBySlug } from '@app/actions/getRecipeBySlug'
import Image from 'next/image'

// export async function generateStaticParams() {
//   const slugs = await getRecipesSlugs()

//   if (slugs.isErr() || !slugs.value) {
//     return []
//   }

//   return slugs.value.map((slug) => ({
//     slug,
//   }))
// }

export const revalidate = 86400 // 24 hours
export const dynamicParams = true

export default async function RecipePage({ params }: { params: PageParams }) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    throw new Error('Recipe not found')
  }

  const { imageUrl, title, difficulty, time, ingredients, instruction } = recipe
  const tags = [{ name: 'Cheap' }]

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <div className="relative h-screen bg-black">
      {/* Image container */}
      <div className="absolute top-0 h-3/5 w-full">
        {imageUrl && (
          <Image alt={title} src={imageUrl} className="h-full w-full object-cover" fill priority />
        )}

        {/* Custom gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black"></div>
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
                <div className="text-blue-gray-dark text-xs uppercase">Difficulty:</div>
                <Level level={difficulty} />
              </div>
            )}
            {time && (
              <div>
                <div className="text-blue-gray-dark text-xs uppercase">Time:</div>
                <Time time={time} />
              </div>
            )}
          </div>

          <div className="document">{ingredients?.toString()}</div>

          <div className="document">{instruction?.toString()}</div>
        </div>
      </div>
    </div>
  )
}
