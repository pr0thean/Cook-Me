import Link from 'next/link'
import ContentfulImage from '@app/components/atoms/contentful-image'
import { Time } from '@app/components/atoms/time'
import { Level } from '@app/components/atoms/level'
import { RecipeCollectionType } from '@typings/models/recipe-collection.model'
import { PercentBadgeIcon } from '@heroicons/react/24/outline'

type Props = {
  data: RecipeCollectionType
}

const RecipeCard = ({ data }: Props) => {
  const { image, name, level, time, slug, tags } = data

  const isCheap = tags?.some((tag) => tag.name === 'Cheap')

  return (
    <Link href={`/recipes/${slug}`} className="block h-56">
      <div className="relative h-full rounded-lg">
        <div className="h-full w-full">
          {image && <ContentfulImage alt={image.title} src={image.url} className="rounded-lg" />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-[52px] justify-between rounded-b-lg bg-black/50 px-2 py-1 text-white backdrop-blur-sm">
          <h2 className="text-lg">{name}</h2>

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