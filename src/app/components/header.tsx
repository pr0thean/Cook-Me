'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import Search from '@app/components/search'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev)
  }

  const variants = {
    hidden: { y: 0, opacity: 0 },
    visible: { y: 64, opacity: 1 },
  }

  return (
    <div className="relative">
      <header className="fixed top-0 z-30 flex w-full items-center justify-between bg-black p-4 text-white">
        {pathname !== '/' ? (
          <ArrowLeftIcon onClick={() => router.back()} className="h-6 w-6">
            Back
          </ArrowLeftIcon>
        ) : (
          <div></div>
        )}

        <Link href="/" className="text-2xl font-bold">
          Home
        </Link>

        <MagnifyingGlassIcon className="h-6 w-6" onClick={toggleSearch} />
      </header>

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
            <Search />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
