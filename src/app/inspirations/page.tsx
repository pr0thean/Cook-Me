import type { Metadata } from 'next'
import { Hero } from '@/components/molecules/Hero'
import { InspirationsWall } from '@/features/inspirations/components/InspirationsWall'
import { getInspirationPhotos } from '@/lib/data/posts'

export const metadata: Metadata = {
  title: 'Inspirations | Cook Me',
  description: 'Photos of dishes the community cooked from Cook Me recipes',
}

export const revalidate = 86400 // 24 hours; post changes revalidate the page on demand

export default async function InspirationsPage() {
  const firstPage = await getInspirationPhotos()

  return (
    <div className="pb-8">
      <Hero
        heading="Inspirations"
        imageUrl={firstPage.photos[0]?.url ?? '/assets/images/all-recipes.jpeg'}
      />

      <div className="mt-6 space-y-6 px-4 md:mt-8 md:px-6">
        <p className="text-gray-light text-center">
          What the community cooked from these recipes. Tap a photo to see the comment.
        </p>

        <InspirationsWall firstPage={firstPage} />
      </div>
    </div>
  )
}
