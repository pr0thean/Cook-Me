import { err, ok, ResultAsync } from 'neverthrow'
import { getContentfulClient } from '@services/contentful/contentful-client'
import intoError from '@utils/intoError'

export async function getRecipesSlugs() {
  const response = await ResultAsync.fromPromise(
    getContentfulClient()
      .getRecipesSlugs()
      .then((response) => {
        if (!response.recipeCollection || response.recipeCollection?.items?.length === 0) {
          return null
        }

        return response.recipeCollection.items.map((recipe) => {
          if (recipe?.slug) {
            return recipe.slug
          }
        })
      }),
    (error) => intoError(error, 'Failed to get recipes slugs')
  )

  if (response.isErr()) {
    return err(response.error)
  }

  return ok(response.value)
}
