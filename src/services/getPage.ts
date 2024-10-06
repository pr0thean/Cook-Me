import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import intoError from '@utils/intoError'
import { pageSchema } from '@typings/models/page.model'

export function getPage(slug: string) {
  return ResultAsync.fromPromise(getContentfulClient().getPage({ slug }), (error) =>
    intoError(error, 'Error occurred when fetching page')
  ).andThen((response) => {
    if (!response.landingPageCollection || response.landingPageCollection?.items?.length === 0) {
      return err(new Error('Page not found'))
    }

    return ResultAsync.fromPromise(
      Promise.resolve(z.array(pageSchema).parse(response.landingPageCollection?.items)),
      (error) => intoError(error, 'Invalid page data')
    )
  })
}
