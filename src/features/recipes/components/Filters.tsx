'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'

import { useDebounceValue } from 'usehooks-ts'
import { useUpdateEffect } from 'react-use'
import { TextInput } from 'components/atoms/TextInput'
import { Select } from 'components/atoms/select/Select'
import { SelectOption } from 'types/select-option'
import { useOptimistic, useState, useTransition } from 'react'

type Props = {
  categoryOptions: SelectOption[]
  tagsOptions: SelectOption[]
  difficultyOptions: SelectOption[]
}

type FilterState = {
  category: string
  tag: string
  difficulty: string
}

export const Filters = ({ categoryOptions, tagsOptions, difficultyOptions }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [, startTransition] = useTransition()

  // Derive initial state from URL
  const urlState: FilterState = {
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    difficulty: searchParams.get('difficulty') || '',
  }

  // Use optimistic state for instant UI updates
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    urlState,
    (state, newState: Partial<FilterState>) => ({
      ...state,
      ...newState,
    })
  )

  const onSetFilter = (
    type: 'search' | 'category' | 'tag' | 'difficulty',
    value: SelectOption['value'] | null
  ) => {
    startTransition(() => {
      if (type !== 'search') {
        setOptimisticFilters({ [type]: value || '' })
      }

      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(type, value)
      } else {
        params.delete(type)
      }

      router.push(`${pathname}?${params.toString()}`)
    })
  }

  useUpdateEffect(() => {
    onSetFilter('search', debouncedSearch || null)
  }, [debouncedSearch])

  const hasActiveFilters =
    searchParams.get('search') ||
    searchParams.get('category') ||
    searchParams.get('tag') ||
    searchParams.get('difficulty')

  const clearAllFilters = () => {
    setSearchInput('')

    startTransition(() => {
      setOptimisticFilters({ category: '', tag: '', difficulty: '' })
      router.push(pathname)
    })
  }

  return (
    <div className="space-y-4 px-4">
      <div className="relative">
        <TextInput
          name="search"
          autoFocus
          type="text"
          placeholder="Search recipes..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          icon={<MagnifyingGlassIcon width={20} fill="#747474" />}
          inputSize="lg"
        />

        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="text-gray absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors hover:text-white"
            aria-label="Clear search"
          >
            <XMarkIcon width={20} />
          </button>
        )}
      </div>

      <div className="items-baseline justify-between gap-3 space-y-4 sm:flex">
        {categoryOptions.length > 0 && (
          <Select
            name="category"
            items={categoryOptions}
            label="Category"
            placeholder="Select category..."
            onValueChange={(e) => onSetFilter('category', e)}
            value={optimisticFilters.category}
            allowClear
          />
        )}

        {tagsOptions.length > 0 && (
          <Select
            name="tag"
            items={tagsOptions}
            label="Tags"
            placeholder="Select tag..."
            onValueChange={(e) => onSetFilter('tag', e)}
            value={optimisticFilters.tag}
            allowClear
          />
        )}

        {difficultyOptions.length > 0 && (
          <Select
            name="difficulty"
            items={difficultyOptions}
            label="Difficulty"
            placeholder="Select difficulty..."
            onValueChange={(e) => onSetFilter('difficulty', e)}
            value={optimisticFilters.difficulty}
            allowClear
          />
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-orange cursor-pointer text-sm underline transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
