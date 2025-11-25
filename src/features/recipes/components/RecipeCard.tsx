import Link from 'next/link'
import Image from 'next/image'
import { Time } from '@/features/recipes/components/time'
import { Difficulty } from '@/features/recipes/components/difficulty'
import { PercentBadgeIcon } from '@heroicons/react/24/outline'
import { Recipe } from '@/types/prisma-types'

type Props = {
  data: Recipe
}

export const RecipeCard = ({ data }: Props) => {
  const { imageUrl, title, slug, difficulty, time, tags } = data

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <Link
      href={`/recipes/${slug}`}
      className="block h-56 rounded-lg transition-shadow duration-300 hover:shadow-[0_0_5px_2px_rgba(255,101,47,1)]" // orange
    >
      <div className="relative h-full">
        <div className="relative h-full w-full">
          {imageUrl && (
            <Image
              alt={title}
              src={imageUrl}
              className="h-full w-full rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 50vw, 412px"
            />
          )}
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex h-[52px] justify-between rounded-b-lg bg-black/50 px-2 py-1 text-white backdrop-blur-xs">
          <h2 className="mt-2 mr-16 truncate text-xl">{title}</h2>

          <div className="absolute right-0 bottom-0 flex flex-col space-y-1 px-2 py-1 text-right text-sm font-semibold backdrop-blur-xs">
            {time && <Time time={time} isWhite />}
            {difficulty && <Difficulty difficulty={difficulty} isWhite />}
          </div>
        </div>

        {isCheap && (
          <div className="absolute top-2 right-2">
            <PercentBadgeIcon width={30} fill={'#FF652F'} />
          </div>
        )}
      </div>
    </Link>
  )
}
