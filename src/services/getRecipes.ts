import { contentFulClient } from '@services/contentful'
import { TypeRecipeSkeleton } from '@typings/contentful/generated-types'
import { EntryCollection } from 'contentful'

export type RecipeFields = EntryCollection<
  TypeRecipeSkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  string
>['items'][number]['fields']

export async function getRecipes(name?: string): Promise<RecipeFields[]> {
  const searchParams: Record<string, string | number> = {
    content_type: 'recipe',
    include: 2,
  }

  if (name) {
    searchParams['fields.name[match]'] = name
  }

  const response =
    await contentFulClient.withoutUnresolvableLinks.getEntries<TypeRecipeSkeleton>(searchParams)

  return response.items.map((item) => item.fields)
}
