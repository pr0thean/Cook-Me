import Link from 'next/link'
import { getInspirationPhotos } from '@/lib/data/posts'
import { HOME_COMMUNITY_PHOTOS, postHref } from '../types'
import { PhotoTile } from './PhotoTile'

/** Home page strip: the newest community photos, each linking to its comment, plus "See all". Hidden while there are none. */
export async function CommunityPhotos() {
  const { photos } = await getInspirationPhotos({ take: HOME_COMMUNITY_PHOTOS })

  if (photos.length === 0) return null

  return (
    <section className="space-y-4 md:space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Latest from the community</h2>
        <Link href="/inspirations" className="text-orange shrink-0 font-semibold hover:underline">
          See all →
        </Link>
      </div>

      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0 sm:pb-0">
        {photos.map((photo) => (
          <li key={photo.id} className="w-36 shrink-0 snap-start sm:w-auto">
            <Link
              href={postHref(photo)}
              className="focus-visible:ring-orange block rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <PhotoTile photo={photo} sizes="(min-width: 640px) 16vw, 144px" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
