import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ok, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import intoError from '@utils/intoError'
import { tagSchema } from '@typings/models/tag.model'

export async function getTags() {
  const tagCollectionResponse = await ResultAsync.fromPromise(
    getContentfulClient()
      .getTagCollection()
      .then((response) => {
        if (!response.tagCollection || response.tagCollection?.items?.length === 0) {
          return null
        }
        return z.array(tagSchema).parse(response.tagCollection?.items)
      }),
    (error) => intoError(error, 'Failed to get tag collection')
  )

  if (tagCollectionResponse.isErr()) {
    return err(tagCollectionResponse.error)
  }

  return ok(tagCollectionResponse.value)
}
