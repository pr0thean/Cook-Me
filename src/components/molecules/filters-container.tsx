import { Filters } from '@components/molecules/filters'

export const FiltersContainer = async () => {
  const categoryOptions = [{ value: 'All', label: 'All' }]

  const tagsOptions = [{ value: 'All', label: 'All' }]

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Average', label: 'Average' },
    { value: 'Hard', label: 'Hard' },
  ]

  return <Filters {...{ categoryOptions, tagsOptions, difficultyOptions }} />
}
