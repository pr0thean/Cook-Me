'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useSearchParams } from 'next/navigation'
import { FormEvent, RefObject, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

export type ClickOutsideEvent = MouseEvent | TouchEvent | FocusEvent

type Props = {
  handleClickOutside: (event: ClickOutsideEvent) => void
  handleNavigate: (params: string) => void
}

const HeaderSearch = ({ handleClickOutside, handleNavigate }: Props) => {
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
        <input
          autoFocus
          type="text"
          placeholder="Search recipes..."
          className="block w-full border-b border-gray bg-black/80 px-10 py-3 text-white outline-0 backdrop-blur-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <MagnifyingGlassIcon width={20} className="absolute left-2 top-[14px]" fill="#747474" />
      </div>
    </form>
  )
}

export default HeaderSearch
