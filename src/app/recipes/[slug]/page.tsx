import { PageParams } from '@/types/page-params'
import { Difficulty } from '@/features/recipes/components/difficulty'
import { Time } from '@/features/recipes/components/time'

import { CheapTip } from '@/features/guided-tour/components/CheapTip'
import { getRecipeBySlug } from '@/app/actions/getRecipeBySlug'
import Image from 'next/image'
import { getRecipes } from '@/app/actions/getRecipes'
import { RichTextViewer } from '@/components/molecules/text-editor/RichTextViewer'
import { Content } from '@tiptap/react'

export async function generateStaticParams() {
  try {
    const { recipes } = await getRecipes()

    return recipes.map((recipe) => ({
      slug: recipe.slug,
    }))
  } catch (error) {
    console.warn('Could not fetch recipes for static generation:', error)
    return []
  }
}

export const revalidate = 86400 // 24 hours
export const dynamicParams = true

export default async function RecipePage({ params }: { params: PageParams }) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    throw new Error('Recipe not found')
  }

  const { imageUrl, title, difficulty, time, ingredients, instruction, tags, description } = recipe

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
        <div className="page-content-shadow mt-[300px] mb-8 w-11/12 space-y-6 rounded-xl bg-white p-5 text-black md:space-y-8 md:p-10">
          <div className="flex justify-between md:mb-6">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {isCheap && <CheapTip />}
          </div>

          <div className="flex justify-between font-semibold md:mb-6">
            {difficulty && (
              <div>
                <div className="text-blue-gray-dark text-xs uppercase">Difficulty:</div>
                <Difficulty difficulty={difficulty} />
              </div>
            )}
            {time && (
              <div>
                <div className="text-blue-gray-dark text-xs uppercase">Time:</div>
                <Time time={time} />
              </div>
            )}
          </div>

          {description && (
            <p className="border-orange text-blue-gray bg-gray-lighter rounded-md border-l-4 px-5 py-4 italic">
              {description}
            </p>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Ingredients</h2>
            {ingredients && <RichTextViewer content={ingredients as Content} />}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Instruction</h2>
            {instruction && <RichTextViewer content={instruction as Content} />}
          </div>
        </div>
      </div>
    </div>
  )
}
