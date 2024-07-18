import Link from 'next/link'
import ContentfulImage from '@app/components/contentful-image'
import type { RecipeFields } from '@services/getRecipes'
import { Time } from '@app/components/time'
import { Level } from '@app/components/level'

type Props = {
  data: RecipeFields
}

const RecipeCard = ({ data }: Props) => {
  const { image, name, level, time, slug } = data

  return (
    <Link href={`/recipes/${slug}`} className="block h-56">
      <div className="relative h-full rounded-lg">
        <div className="h-full w-full">
          {image && (
            <ContentfulImage
              alt={image.fields.title || ''}
              src={image.fields.file?.url || ''}
              className="rounded-lg"
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-[52px] justify-between rounded-b-lg bg-black/50 px-2 py-1 text-white backdrop-blur-sm">
          <h2 className="text-lg">{name}</h2>

          <div className="absolute bottom-0 right-0 flex flex-col space-y-1 px-2 py-1 text-right text-sm font-semibold backdrop-blur-sm">
            {time && <Time time={time} isWhite />}
            {level && <Level level={level} isWhite />}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
