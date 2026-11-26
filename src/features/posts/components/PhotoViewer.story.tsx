import { useState } from 'react'
import type { PostImageData } from '../types'
import { PhotoViewer } from './PhotoViewer'

/** A 1×1 PNG, so the viewer has a real image to show without any network */
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/** Test-only images; ids double as the photo names shown by the story */
export const storyImages = (count: number): PostImageData[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    url: PIXEL,
    width: 1,
    height: 1,
  }))

type Props = {
  imageCount: number
  initialIndex: number | null
  caption?: string
  showCount?: boolean
}

/**
 * `PhotoViewer` with its own state, as the posts and Inspirations pages use it.
 * Shows the open index outside the dialog so tests can check navigation.
 */
export function PhotoViewerStory({ imageCount, initialIndex, caption, showCount }: Props) {
  const [index, setIndex] = useState<number | null>(initialIndex)

  return (
    <div>
      <output aria-label="Open index">{index === null ? 'closed' : index}</output>

      <PhotoViewer
        images={storyImages(imageCount)}
        index={index}
        onIndexChange={setIndex}
        title="Photo by Anna"
        caption={caption}
        showCount={showCount}
      />
    </div>
  )
}
