'use client'

import { useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { QuestionMarkCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import HeaderSearch, { ClickOutsideEvent } from '@components/molecules/header-search'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeaderLink } from '@components/atoms/HeaderLink'
import Link from 'next/link'

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

  const handleRestartTour = () => {
    localStorage.removeItem('tour-completed')
    localStorage.removeItem('tour-cheap-tip-completed')

    if (pathname === '/') {
      window.location.reload()
    } else {
      router.push('/')
    }
  }

  const variants = {
    hidden: { y: 0, opacity: 0 },
    visible: { y: 64, opacity: 1 },
  }

  const enableHeaderSearch = pathname !== '/recipes'

  return (
    <div className="relative">
      <header className="border-gray fixed top-0 z-30 h-16 w-full border-b bg-black px-6 py-4 text-white">
        <div
          id="tour-navigation"
          className="absolute left-6 flex gap-4 sm:left-1/2 sm:-translate-x-1/2 sm:transform sm:gap-8"
        >
          <HeaderLink href="/" label="Home" isSelected={pathname === '/'} />
          <HeaderLink href="/recipes" label="Recipes" isSelected={pathname === '/recipes'} />
          <HeaderLink href="/about" label="About" isSelected={pathname === '/about'} />
        </div>

        <div className="absolute top-5 right-6 flex gap-4">
          <Link href="/login">
            <UserIcon
              className="hover:text-orange h-5 w-5 cursor-pointer sm:h-6 sm:w-6"
              strokeWidth={2}
            />
          </Link>

          <div id="tour-restart">
            <QuestionMarkCircleIcon
              className="hover:text-orange h-5 w-5 cursor-pointer sm:h-6 sm:w-6"
              strokeWidth={2}
              onClick={handleRestartTour}
            />
          </div>

          {enableHeaderSearch && (
            <div ref={searchIconRef} id="tour-search">
              <MagnifyingGlassIcon
                className="hover:text-orange h-5 w-5 cursor-pointer sm:h-6 sm:w-6"
                strokeWidth={2}
                onClick={() => setIsSearchVisible((prev) => !prev)}
                aria-label="search-icon"
              />
            </div>
          )}
        </div>
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
              className="fixed top-0 right-0 left-0 z-20"
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
