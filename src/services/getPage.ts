import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ok, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import intoError from '@utils/intoError'
import { pageSchema } from '@typings/models/page.model'

export async function getPage(slug: string) {
  const pageResponse = await ResultAsync.fromPromise(
    getContentfulClient()
      .getPage({ slug })
      .then((response) => {
        if (
          !response.landingPageCollection ||
          response.landingPageCollection?.items?.length === 0
        ) {
          return null
        }
        return z.array(pageSchema).parse(response.landingPageCollection?.items)
      }),
    (error) => intoError(error, 'Page not found')
  )

  if (pageResponse.isErr()) {
    return err(pageResponse.error)
  }

  return ok(pageResponse.value)
}
