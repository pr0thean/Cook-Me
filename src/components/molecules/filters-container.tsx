import { SelectOption } from '@components/atoms/select'
import { Filters } from '@components/molecules/filters'

export const FiltersContainer = async () => {
  let categoryOptions: SelectOption[] = [{ value: 'All', label: 'All' }]

  let tagsOptions: SelectOption[] = [{ value: 'All', label: 'All' }]

  const levelOptions: SelectOption[] = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Average', label: 'Average' },
    { value: 'Hard', label: 'Hard' },
  ]

  return <Filters {...{ categoryOptions, tagsOptions, levelOptions }} />
}
