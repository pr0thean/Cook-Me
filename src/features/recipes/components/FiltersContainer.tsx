import { getCategories } from '@/lib/data/categories'
import { getTags } from '@/lib/data/tags'
import { SelectOption } from '@/types/select-option'
import { Filters } from './Filters'

const difficultyOptions: SelectOption[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
]

export const FiltersContainer = async () => {
  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.slug,
    label: category.name,
  }))

  const tagsOptions: SelectOption[] = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }))

  return <Filters {...{ categoryOptions, tagsOptions, difficultyOptions }} />
}
