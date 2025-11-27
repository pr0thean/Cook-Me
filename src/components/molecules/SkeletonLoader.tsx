import React from 'react'

type Props = {
  type: 'frontpage' | 'page' | 'category' | 'recipes' | 'recipes-list' | 'recipe'
}

const SkeletonLoader = ({ type }: Props) => {
  if (type === 'frontpage') {
    return (
      <div className="min-h-screen">
        <div className="bg-gray-dark h-64 animate-pulse md:h-96" />

        <div className="grid grid-cols-2 gap-4 p-4 sm:p-6 md:grid-cols-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-dark aspect-square animate-pulse rounded-sm" />
          ))}
        </div>

        <div className="bg-gray-dark mx-4 mt-10 mb-10 h-10 w-full animate-pulse rounded-xs sm:mx-auto sm:w-1/2" />

        <div className="space-y-6 px-4 sm:px-6 md:space-y-10">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-dark h-24 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'category') {
    return (
      <div className="min-h-screen space-y-4">
        <div className="bg-gray-dark h-64 animate-pulse md:h-96" />

        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-dark h-48 animate-pulse rounded-sm" />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'recipes') {
    return (
      <div className="min-h-screen space-y-8">
        <div className="bg-gray-dark h-64 animate-pulse md:h-96" />

        <div className="bg-gray-dark mx-4 h-80 animate-pulse rounded-sm md:mx-6 md:h-52" />

        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-dark h-48 animate-pulse rounded-sm" />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'recipes-list') {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-dark h-48 animate-pulse rounded-sm" />
        ))}
      </div>
    )
  }

  if (type === 'page') {
    return (
      <div className="min-h-screen">
        <div className="bg-gray-dark h-64 animate-pulse md:h-96" />

        <div className="bg-gray-dark mx-auto mt-6 h-64 w-11/12 animate-pulse rounded-xl md:h-96" />
      </div>
    )
  }

  // recipe
  return (
    <div className="relative min-h-screen">
      <div className="bg-gray-dark h-96 animate-pulse bg-linear-to-b from-transparent via-black/10 to-black" />

      <div className="bg-gray-dark absolute top-[300px] right-0 left-0 m-auto h-96 w-11/12 animate-pulse rounded-xl md:h-[600px]" />
    </div>
  )
}

export default SkeletonLoader
