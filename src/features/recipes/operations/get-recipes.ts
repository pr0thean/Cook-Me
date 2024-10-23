import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ok, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import { recipeCollectionSchema } from '@features/recipes/models/recipe-collection.model'
import intoError from '@utils/intoError'

export async function getRecipes(name?: string, level?: string, category?: string, tag?: string) {
  const recipeCollectionResponse = await ResultAsync.fromPromise(
    getContentfulClient()
      .getRecipeCollection({ name, level, category, tag })
      .then((response) => {
        if (!response.recipeCollection || response.recipeCollection?.items?.length === 0) {
          return null
        }

        const recipeItems = response.recipeCollection.items.map((recipeItem) => {
          return {
            ...recipeItem,
            tags: recipeItem?.tagsCollection?.items,
          }
        })

        return z.array(recipeCollectionSchema).parse(recipeItems)
      }),
    (error) => intoError(error, 'Failed to get recipe collection')
  )

  if (recipeCollectionResponse.isErr()) {
    return err(recipeCollectionResponse.error)
  }

  return ok(recipeCollectionResponse.value)
}
