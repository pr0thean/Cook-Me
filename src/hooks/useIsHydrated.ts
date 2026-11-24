import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

/**
 * `false` on the server and during hydration, `true` afterwards. Use it to render client-only values
 * (current time, the signed-in viewer) without making the first client render differ from the server HTML.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
}
