'use-client'

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const Search = () => {
  const router = useRouter()
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/recipes?search=${text}`)
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search recipes..."
        className="block w-full border-b border-gray bg-black/80 px-10 py-3 text-white outline-0 backdrop-blur-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MagnifyingGlassIcon width={20} className="absolute left-2 top-[14px]" fill="#747474" />

      <XMarkIcon
        onClick={() => setText('')}
        width={24}
        className="absolute right-2 top-3"
        fill="#747474"
      />
    </form>
  )
}

export default Search
