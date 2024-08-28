'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import HeaderSearch, { ClickOutsideEvent } from '@app/components/molecules/header-search'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchIconRef = useRef<HTMLDivElement>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleClickOutside = (event: ClickOutsideEvent) => {
    // if event.target is the search icon, don't close the search in this function
    if (searchIconRef.current && searchIconRef.current.contains(event.target as Node)) {
      return
    }

    setIsSearchVisible(false)
  }

  const handleNavigate = (params: string) => {
    setIsSearchVisible(false)
    router.push(`/recipes?${params.toString()}`)
  }

  const variants = {
    hidden: { y: 0, opacity: 0 },
    visible: { y: 64, opacity: 1 },
  }

  const enableHeaderSearch = pathname !== '/recipes'

  return (
    <div className="relative">
      <header className="fixed top-0 z-30 flex w-full items-center justify-between border-b border-gray bg-black p-4 text-white">
        {pathname !== '/' ? (
          <ArrowLeftIcon onClick={() => router.back()} className="h-6 w-6">
            Back
          </ArrowLeftIcon>
        ) : (
          <div className="w-6"></div>
        )}

        <Link href="/" className="text-2xl font-bold">
          Home
        </Link>

        {enableHeaderSearch ? (
          <div ref={searchIconRef}>
            <MagnifyingGlassIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsSearchVisible((prev) => !prev)}
              aria-label="search-icon"
            />
          </div>
        ) : (
          <div />
        )}
      </header>

      {enableHeaderSearch && (
        <AnimatePresence>
          {isSearchVisible && (
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 right-0 top-0 z-20"
            >
              <HeaderSearch
                handleClickOutside={handleClickOutside}
                handleNavigate={handleNavigate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
