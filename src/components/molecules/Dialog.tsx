'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

export const Dialog = ({ open, onOpenChange, title, description, children }: Props) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs" />

        <DialogPrimitive.Content
          className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 text-black shadow-lg focus:outline-hidden md:p-8"
          // Without a description Radix warns unless aria-describedby is explicitly unset
          {...(!description && { 'aria-describedby': undefined })}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="text-2xl font-semibold">
              {title}
            </DialogPrimitive.Title>

            <DialogPrimitive.Close
              aria-label="Close"
              className="text-blue-gray cursor-pointer hover:text-black"
            >
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            </DialogPrimitive.Close>
          </div>

          {description && (
            <DialogPrimitive.Description className="text-blue-gray mb-4 text-sm">
              {description}
            </DialogPrimitive.Description>
          )}

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
