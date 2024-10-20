'use client'

export default function ClientOnly() {
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
    require('./index')
  }

  return null
}
