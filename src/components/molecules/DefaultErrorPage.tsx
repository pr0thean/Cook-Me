'use client'

import { Button } from '@components/atoms/button'

export const DefaultErrorPage = () => {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
        <p
          className="text-center text-3xl tracking-widest text-yellow"
          style={{ fontFamily: 'fantasy' }}
        >
          An error occurred...
        </p>
        <Button label="Go to home page" link="/" variant="link" />
      </div>
    </div>
  )
}
