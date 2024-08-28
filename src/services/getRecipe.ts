import { getContentfulClient } from '@services/contentful/contentful-client'
import { err, ok, ResultAsync } from 'neverthrow'
import { z } from 'zod'
import intoError from '@utils/intoError'
import { recipeSchema } from '@typings/models/recipe.model'

export async function getRecipe(slug: string) {
  const recipeResponse = await ResultAsync.fromPromise(
    getContentfulClient()
      .getRecipe({ slug })
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

        return z.array(recipeSchema).parse(recipeItems)
      }),
    (error) => intoError(error, 'Recipe not found')
  )

  if (recipeResponse.isErr()) {
    return err(recipeResponse.error)
  }

  return ok(recipeResponse.value)
}
