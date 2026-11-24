'use client'

import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { KeyboardEvent } from 'react'
import type { PostImageData } from '../types'

type Props = {
  images: PostImageData[]
  /** Index of the open photo, or `null` when closed */
  index: number | null
  onIndexChange: (index: number | null) => void
  /** Accessible title, e.g. "Photo by Anna" */
  title: string
}

const navButtonClass =
  'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/60 p-2 text-white hover:bg-black/80 disabled:invisible'

/** Full-screen view of a post's photos, with prev/next (buttons and arrow keys) when there are several */
export function PhotoViewer({ images, index, onIndexChange, title }: Props) {
  const image = index === null ? undefined : images[index]
  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < images.length - 1

  const showPrev = () => hasPrev && onIndexChange(index - 1)
  const showNext = () => hasNext && onIndexChange(index + 1)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') showPrev()
    if (event.key === 'ArrowRight') showNext()
  }

  return (
    <DialogPrimitive.Root
      open={Boolean(image)}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/90" />

        {image && (
          <DialogPrimitive.Content
            onKeyDown={handleKeyDown}
            aria-describedby={undefined}
            className="fixed inset-0 z-50 focus:outline-hidden"
          >
            <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>

            <Image
              key={image.id}
              src={image.url}
              alt=""
              fill
              sizes="100vw"
              className="object-contain p-4 md:p-10"
            />

            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            >
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            </DialogPrimitive.Close>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  disabled={!hasPrev}
                  aria-label="Previous photo"
                  className={`${navButtonClass} left-3`}
                >
                  <ChevronLeftIcon className="h-6 w-6" strokeWidth={2} />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  disabled={!hasNext}
                  aria-label="Next photo"
                  className={`${navButtonClass} right-3`}
                >
                  <ChevronRightIcon className="h-6 w-6" strokeWidth={2} />
                </button>

                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                  {index! + 1} / {images.length}
                </span>
              </>
            )}
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
