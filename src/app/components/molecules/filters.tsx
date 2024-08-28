'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

import { Select, SelectOption } from '@app/components/atoms/select'
import { useDebounceValue } from 'usehooks-ts'
import { useUpdateEffect } from 'react-use'

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

  useUpdateEffect(() => {
    onSetFilter('search', searchText || null)
  }, [searchText])

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

  const getFilterDefaultValue = (type: 'category' | 'tag' | 'level', options: SelectOption[]) => {
    const value = searchParams.get(type)

    return options.find((option) => option.value === value) || null
  }

  return (
    <div className="space-y-4 px-4">
      <div className="relative">
        <input
          autoFocus
          type="text"
          placeholder="Search recipes..."
          className="block w-full rounded-[4px] border border-gray bg-black/80 px-8 py-2 text-white outline-0"
          defaultValue={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <MagnifyingGlassIcon width={20} className="absolute left-2 top-[10px]" fill="#747474" />
      </div>

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
