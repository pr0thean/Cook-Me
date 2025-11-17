'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { useDebounceValue } from 'usehooks-ts'
import { useUpdateEffect } from 'react-use'
import { TextInput } from 'components/atoms/TextInput'
import { Select } from 'components/atoms/select/Select'
import { SelectOption } from 'types/select-option'

type Props = {
  categoryOptions: SelectOption[]
  tagsOptions: SelectOption[]
  difficultyOptions: SelectOption[]
}

export const Filters = ({ categoryOptions, tagsOptions, difficultyOptions }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useDebounceValue(searchParams.get('search') || '', 500)

  const onSetFilter = (
    type: 'search' | 'category' | 'tag' | 'difficulty',
    value: SelectOption['value'] | null
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  useUpdateEffect(() => {
    onSetFilter('search', searchText || null)
  }, [searchText])

  const getFilterDefaultValue = (
    type: 'category' | 'tag' | 'difficulty',
    options: SelectOption[]
  ) => {
    const value = searchParams.get(type)

    return options.find((option) => option.value === value) || null
  }

  return (
    <div className="space-y-4 px-4">
      <TextInput
        name="search"
        autoFocus
        type="text"
        placeholder="Search recipes..."
        defaultValue={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        icon={<MagnifyingGlassIcon width={20} fill="#747474" />}
        inputSize="lg"
      />

      <div className="items-baseline justify-between gap-3 space-y-4 sm:flex">
        {categoryOptions && (
          <Select
            name="category"
            items={categoryOptions}
            label="Category"
            placeholder="Select category..."
            onValueChange={(e) => onSetFilter('category', e || null)}
            value={getFilterDefaultValue('category', categoryOptions)?.value}
          />
        )}

        {tagsOptions && (
          <Select
            name="tag"
            items={tagsOptions}
            label="Tags"
            placeholder="Select tag..."
            onValueChange={(e) => onSetFilter('tag', e || null)}
            value={getFilterDefaultValue('tag', tagsOptions)?.value}
          />
        )}

        {difficultyOptions && (
          <Select
            name="difficulty"
            items={difficultyOptions}
            label="Difficulty"
            placeholder="Select difficulty..."
            onValueChange={(e) => onSetFilter('difficulty', e || null)}
            value={getFilterDefaultValue('difficulty', difficultyOptions)?.value}
          />
        )}
      </div>
    </div>
  )
}
