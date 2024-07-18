import { contentFulClient } from '@services/contentful'
import { TypeRecipeSkeleton } from '@typings/contentful/generated-types'
import { EntryCollection } from 'contentful'

export type RecipeFields = EntryCollection<
  TypeRecipeSkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  string
>['items'][number]['fields']

export async function getRecipe(slug: string): Promise<RecipeFields> {
  const response = await contentFulClient.withoutUnresolvableLinks.getEntries<TypeRecipeSkeleton>({
    content_type: 'recipe',
    'fields.slug': slug,
    include: 2,
  })

  if (!response.items.length) {
    throw new Error('Recipe not found')
  }

  return response.items[0].fields
}
