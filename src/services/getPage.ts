import { contentFulClient } from '@services/contentful'
import { TypeLandingPageSkeleton } from '@typings/contentful/generated-types/TypeLandingPage'

export async function getPage(slug: string) {
  const res = await contentFulClient.withoutUnresolvableLinks.getEntries<TypeLandingPageSkeleton>({
    content_type: 'landingPage', // should be 'page' but contentful CLI is fetching 'landingPage'...
    'fields.slug': slug,
    include: 2,
  })

  return res.items[0].fields
}
