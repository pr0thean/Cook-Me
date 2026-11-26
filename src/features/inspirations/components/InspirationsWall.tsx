'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { Spinner } from '@/components/atoms/Spinner'
import { PhotoViewer } from '@/features/posts/components/PhotoViewer'
import { RelativeTime } from '@/features/posts/components/RelativeTime'
import { postHref, type InspirationPhoto, type InspirationsPage } from '../types'
import { useInspirations } from '../useInspirations'
import { PhotoTile } from './PhotoTile'

/** How close to the last loaded photo the viewer gets before the next page is fetched */
const VIEWER_PREFETCH_DISTANCE = 3

/** Photos from every recipe's comments, newest first, with infinite scroll and a full-screen viewer */
export function InspirationsWall({ firstPage }: { firstPage: InspirationsPage }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInspirations(firstPage)

  const photos = data.pages.flatMap((page) => page.photos)
  const openPhoto = openIndex === null ? undefined : photos[openIndex]

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const [sentryRef] = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: isError,
    rootMargin: '0px 0px 600px 0px',
  })

  /** Moves the viewer, loading the next page as it nears the end so "next" keeps working */
  const handleIndexChange = (index: number | null) => {
    setOpenIndex(index)
    if (index !== null && index >= photos.length - VIEWER_PREFETCH_DISTANCE) loadMore()
  }

  if (photos.length === 0) {
    return (
      <p className="text-gray-light text-center">
        No photos yet. Cook something and share it in a recipe&apos;s comments!
      </p>
    )
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => handleIndexChange(index)}
              aria-label={`Open photo of ${photo.recipe.title} by ${photo.author.name}`}
              className="focus-visible:ring-orange block w-full cursor-pointer rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <PhotoTile
                photo={photo}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
            </button>
          </li>
        ))}
      </ul>

      {isError && <p className="mt-8 text-center text-red-500">Could not load more photos.</p>}

      {hasNextPage && !isError && (
        <div
          ref={sentryRef}
          className="text-gray-light mt-8 flex items-center justify-center gap-2"
        >
          <Spinner />
          <span>Loading more photos...</span>
        </div>
      )}

      <PhotoViewer
        images={photos}
        index={openPhoto ? openIndex : null}
        onIndexChange={handleIndexChange}
        title={openPhoto ? `${openPhoto.recipe.title} by ${openPhoto.author.name}` : 'Photo'}
        caption={openPhoto && <PhotoCaption photo={openPhoto} />}
        showCount={false}
      />
    </div>
  )
}

/** Under the open photo: who posted it, when, their text, and the way to the recipe */
function PhotoCaption({ photo }: { photo: InspirationPhoto }) {
  return (
    <div className="mx-auto max-w-3xl space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold">{photo.author.name}</span>
          <RelativeTime date={photo.createdAt} className="text-gray-light text-sm" />
        </div>

        <Link href={postHref(photo)} className="text-orange font-semibold hover:underline">
          {photo.recipe.title} — go to recipe →
        </Link>
      </div>

      {photo.content && (
        <p className="text-sm wrap-break-word whitespace-pre-line text-white/90">{photo.content}</p>
      )}
    </div>
  )
}
