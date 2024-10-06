'use client'

import { SparklesIcon, XMarkIcon } from '@heroicons/react/16/solid'

type Props = {
  text: string
  onClose: () => void
}

export const Tip = ({ text, onClose }: Props) => {
  return (
    <div className="flex items-center gap-1 rounded-full bg-orange px-2 py-1 text-sm text-black">
      <SparklesIcon width={14} fill="hsl(var(--color-gold))" />

      <span>Tip: </span>

      <span>{text}</span>

      <XMarkIcon width={14} className="cursor-pointer" onClick={onClose} />
    </div>
  )
}
