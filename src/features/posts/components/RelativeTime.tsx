'use client'

import { useIsHydrated } from '@/hooks/useIsHydrated'

const absoluteFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
// The server renders in UTC; the browser re-renders in the user's time zone after hydration
const serverFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' })
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "3 hours ago", "yesterday"; older than a month shows the date */
function formatRelative(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)

  if (Math.abs(seconds) >= 30 * 24 * 60 * 60) return absoluteFormat.format(date)

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit)
  }

  return 'just now'
}

/**
 * A post date. The page is cached, so the server renders a plain date and the browser switches to
 * relative time once hydrated (avoids a hydration mismatch and stale "5 minutes ago" in the HTML).
 */
export function RelativeTime({ date, className }: { date: string; className?: string }) {
  const isClient = useIsHydrated()
  const parsed = new Date(date)

  return (
    <time
      dateTime={date}
      title={isClient ? parsed.toLocaleString() : undefined}
      className={className}
    >
      {isClient ? formatRelative(parsed) : serverFormat.format(parsed)}
    </time>
  )
}
