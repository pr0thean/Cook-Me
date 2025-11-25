'use client'
import { TextInput } from '@/components/atoms/TextInput'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useSearchParams } from 'next/navigation'
import { FormEvent, RefObject, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

export type ClickOutsideEvent = MouseEvent | TouchEvent | FocusEvent

type Props = {
  handleClickOutside: (event: ClickOutsideEvent) => void
  handleNavigate: (params: string) => void
}

export const HeaderSearch = ({ handleClickOutside, handleNavigate }: Props) => {
  const ref = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const [text, setText] = useState(searchParams.get('search') || '')

  useOnClickOutside(ref as RefObject<HTMLFormElement>, (event) => handleClickOutside(event))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (text) {
      params.set('search', text)
    } else {
      params.delete('search')
    }

    handleNavigate(params.toString())
  }

  return (
    <form onSubmit={handleSubmit} ref={ref}>
      <div className="relative">
        <TextInput
          name="search"
          autoFocus
          type="text"
          placeholder="Search recipes..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="backdrop-blur-xs"
          icon={<MagnifyingGlassIcon width={20} fill="#747474" />}
          inputSize="lg"
        />
      </div>
    </form>
  )
}
