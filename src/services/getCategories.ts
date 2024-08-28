import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ok, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import intoError from '@utils/intoError'
import { categoryCollectionSchema } from '@typings/models/category-collection.model'

export async function getCategories(slug?: string) {
  const categoryCollectionResponse = await ResultAsync.fromPromise(
    getContentfulClient()
      .getCategoryCollection({ slug })
      .then((response) => {
        if (!response.categoryCollection || response.categoryCollection?.items?.length === 0) {
          return null
        }
        return z.array(categoryCollectionSchema).parse(response.categoryCollection?.items)
      }),
    (error) => intoError(error, 'Failed to get category collection')
  )

  if (categoryCollectionResponse.isErr()) {
    return err(categoryCollectionResponse.error)
  }

  return ok(categoryCollectionResponse.value)
}
