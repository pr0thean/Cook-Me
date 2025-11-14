import { RefObject, useEffect } from 'react'

type Props = {
  triggerRef: RefObject<HTMLButtonElement | null>
  setTriggerWidth: (e: number) => void
  value: unknown
  items: Array<unknown>
}

/**
 * Measure trigger width after layout is complete
 */
export const useMeasureWidth = ({ triggerRef, setTriggerWidth, value, items }: Props) => {
  useEffect(() => {
    const measureWidth = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setTriggerWidth(rect.width)
      }
    }

    const timeoutId = setTimeout(measureWidth, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, items, triggerRef, setTriggerWidth])
}
