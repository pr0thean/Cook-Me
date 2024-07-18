'use client'
import Image from 'next/image'
import Button from '@app/components/button'

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <Image
        src="/not-found.webp"
        alt="Not found"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
      />
      <div className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
        <p
          className="text-center text-3xl tracking-widest text-yellow"
          style={{ fontFamily: 'fantasy' }}
        >
          {error.message}
        </p>
        <Button label="Go to home page" link="/" variant="link" />
      </div>
    </div>
  )
}
