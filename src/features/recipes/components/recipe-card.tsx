import Link from 'next/link'
import ContentfulImage from '@components/atoms/contentful-image'
import { Time } from '@features/recipes/components/time'
import { Level } from '@features/recipes/components/level'
import { PercentBadgeIcon } from '@heroicons/react/24/outline'
import { Recipe } from '@prisma/client'

type Props = {
  data: Recipe
}

const RecipeCard = ({ data }: Props) => {
  const { imageUrl, title, slug, difficulty, time } = data

  const tags = [{ name: 'Cheap' }]

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <Link
      href={`/recipes/${slug}`}
      className="block h-56 rounded-lg transition-shadow duration-300 hover:shadow-[0_0_5px_2px_rgba(255,101,47,1)]" // orange
    >
      <div className="relative h-full">
        <div className="h-full w-full">
          {imageUrl && <ContentfulImage alt={title} src={imageUrl} className="rounded-lg" />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-[52px] justify-between rounded-b-lg bg-black/50 px-2 py-1 text-white backdrop-blur-sm">
          <h2 className="mr-16 truncate text-lg">{title}</h2>

          <div className="absolute bottom-0 right-0 flex flex-col space-y-1 px-2 py-1 text-right text-sm font-semibold backdrop-blur-sm">
            {time && <Time time={time} isWhite />}
            {difficulty && <Level level={difficulty} isWhite />}
          </div>
        </div>

        {isCheap && (
          <div className="absolute right-2 top-2">
            <PercentBadgeIcon width={30} fill={'#FF652F'} />
          </div>
        )}
      </div>
    </Link>
  )
}

export default RecipeCard
