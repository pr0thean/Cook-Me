'use client'

import { getCategories } from '@/app/actions/getCategories'
import { Filters } from './Filters'
import { getTags } from '@/app/actions/getTags'
import { SelectOption } from '@/types/select-option'
import { useQuery } from '@tanstack/react-query'

const difficultyOptions: SelectOption[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
]

export const FiltersContainer = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  })

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
