import { getCategories } from 'app/actions/getCategories'
import { Filters } from './Filters'
import { getTags } from 'app/actions/getTags'
import { SelectOption } from 'types/select-option'

export const FiltersContainer = async () => {
  const categories = await getCategories()
  const tags = await getTags()

  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.slug,
    label: category.name,
  }))

  const tagsOptions: SelectOption[] = tags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }))

  const difficultyOptions: SelectOption[] = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Average', label: 'Average' },
    { value: 'Hard', label: 'Hard' },
  ]

  return <Filters {...{ categoryOptions, tagsOptions, difficultyOptions }} />
}
