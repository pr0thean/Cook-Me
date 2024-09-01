import React from 'react'

type Props = {
  type: 'frontpage' | 'page' | 'category' | 'recipe'
}

const SkeletonLoader = ({ type }: Props) => {
  if (type === 'frontpage') {
    return (
      <div className="min-h-screen">
        <div className="h-64 animate-pulse bg-gray md:h-96" />

        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 md:gap-6 md:p-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded bg-gray" />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'page') {
    return (
      <div className="min-h-screen">
        <div className="h-64 animate-pulse bg-gray md:h-96" />

        <div className="mx-auto mt-6 h-64 w-11/12 animate-pulse rounded-xl bg-gray md:h-96" />
      </div>
    )
  }

  if (type === 'category') {
    return (
      <div className="min-h-screen space-y-4">
        <div className="h-64 animate-pulse bg-gray md:h-96" />

        <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded bg-gray" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="h-96 animate-pulse bg-gray bg-gradient-to-b from-transparent via-black/10 to-black" />

      <div className="absolute left-0 right-0 top-[300px] m-auto h-96 w-11/12 animate-pulse rounded-t-lg bg-gray md:h-[600px]" />
    </div>
  )
}

export default SkeletonLoader
