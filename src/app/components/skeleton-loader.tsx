import React from 'react'

type Props = {
  type: 'page' | 'recipe' | 'category'
}

const SkeletonLoader = ({ type }: Props) => {
  if (type === 'page') {
    return (
      <div className="min-h-screen">
        <div className="h-64 animate-pulse bg-gray" />

        <div className="grid grid-cols-2 gap-4 p-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded bg-gray" />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'category') {
    return (
      <div className="min-h-screen space-y-4">
        <div className="h-64 animate-pulse bg-gray" />

        <div className="grid grid-cols-1 gap-4 px-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded bg-gray" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="h-96 animate-pulse bg-gray bg-gradient-to-b from-transparent via-black/10 to-black" />

      <div className="absolute left-0 right-0 top-[300px] m-auto h-96 w-11/12 animate-pulse rounded-t-lg bg-gray" />
    </div>
  )
}

export default SkeletonLoader
