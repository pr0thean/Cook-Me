import { contentFulClient } from '@services/contentful'
import { TypeCategorySkeleton } from '@typings/contentful/generated-types/TypeCategory'
import { EntryCollection } from 'contentful'

type CategoryFields = EntryCollection<
  TypeCategorySkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  string
>['items'][number]['fields']

export async function getCategories(): Promise<CategoryFields[]>
export async function getCategories(categorySlug: string): Promise<CategoryFields>
export async function getCategories(
  categorySlug?: string
): Promise<CategoryFields | CategoryFields[]> {
  const response = await contentFulClient.withoutUnresolvableLinks.getEntries<TypeCategorySkeleton>(
    {
      content_type: 'category',
      'fields.slug': categorySlug,
    }
  )

  if (!response.items.length) {
    throw new Error('Category not found')
  }

  if (categorySlug) {
    return response.items[0].fields
  }

  return response.items.map((item) => item.fields)
}
