import { contentFulClient } from '@services/contentful'
import { TypeRecipeSkeleton } from '@typings/contentful/generated-types'

export async function getRecipesByCategory(category: string) {
  const response = await contentFulClient.withoutUnresolvableLinks.getEntries<TypeRecipeSkeleton>({
    content_type: 'recipe',
    'fields.category.sys.contentType.sys.id': 'category',
    'fields.category.fields.slug': category,
    include: 2,
  })

  return response.items.map((item) => item.fields)
}
