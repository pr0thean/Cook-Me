import Link from 'next/link'
import ContentfulImage from '@components/atoms/contentful-image'
import { Time } from '@features/recipes/components/time'
import { Level } from '@features/recipes/components/level'
import { RecipeCollectionType } from '@features/recipes/models/recipe-collection.model'
import { PercentBadgeIcon } from '@heroicons/react/24/outline'

type Props = {
  data: RecipeCollectionType
}

const RecipeCard = ({ data }: Props) => {
  const { image, name, level, time, slug, tags } = data

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <Link
      href={`/recipes/${slug}`}
      className="block h-56 rounded-lg transition-shadow duration-300 hover:shadow-[0_0_5px_2px_rgba(255,101,47,1)]" // orange
    >
      <div className="relative h-full">
        <div className="h-full w-full">
          {image && <ContentfulImage alt={image.title} src={image.url} className="rounded-lg" />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-[52px] justify-between rounded-b-lg bg-black/50 px-2 py-1 text-white backdrop-blur-sm">
          <h2 className="mr-16 truncate text-lg">{name}</h2>

          <div className="absolute bottom-0 right-0 flex flex-col space-y-1 px-2 py-1 text-right text-sm font-semibold backdrop-blur-sm">
            {time && <Time time={time} isWhite />}
            {level && <Level level={level} isWhite />}
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
