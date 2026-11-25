import Image from 'next/image'
import type { InspirationPhoto } from '../types'

type Props = {
  photo: InspirationPhoto
  /** `next/image` sizes for the tile */
  sizes: string
}

/**
 * A square photo with the recipe name and author on top. The caption shows on hover/focus where
 * there's a mouse, and always on touch screens. Wrap it in a button or link.
 */
export function PhotoTile({ photo, sizes }: Props) {
  return (
    <span className="group bg-blue-gray-dark relative block aspect-square overflow-hidden rounded-md">
      <Image
        src={photo.url}
        alt={`${photo.recipe.title} by ${photo.author.name}`}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-2 pt-6 pb-2 text-left text-white transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:opacity-100">
        <span className="block truncate text-sm font-semibold">{photo.recipe.title}</span>
        <span className="block truncate text-xs text-white/80">{photo.author.name}</span>
      </span>
    </span>
  )
}
