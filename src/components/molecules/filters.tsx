'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { Select, SelectOption } from '@components/atoms/select'
import { useDebounceValue } from 'usehooks-ts'
import { useUpdateEffect } from 'react-use'
import { TextInput } from '@components/atoms/TextInput'

type Props = {
  categoryOptions: SelectOption[]
  tagsOptions: SelectOption[]
  levelOptions: SelectOption[]
}

export const Filters = ({ categoryOptions, tagsOptions, levelOptions }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useDebounceValue(searchParams.get('search') || '', 500)

  const onSetFilter = (
    type: 'search' | 'category' | 'tag' | 'level',
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

  const getFilterDefaultValue = (type: 'category' | 'tag' | 'level', options: SelectOption[]) => {
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
        <Select
          options={categoryOptions}
          label={'Category'}
          handleOnChange={(e) => onSetFilter('category', e?.value || null)}
          value={getFilterDefaultValue('category', categoryOptions)}
        />

        <Select
          options={tagsOptions}
          label={'Tags'}
          handleOnChange={(e) => onSetFilter('tag', e?.value || null)}
          value={getFilterDefaultValue('tag', tagsOptions)}
        />

        <Select
          options={levelOptions}
          label={'Level'}
          handleOnChange={(e) => onSetFilter('level', e?.value || null)}
          value={getFilterDefaultValue('level', levelOptions)}
        />
      </div>
    </div>
  )
}
