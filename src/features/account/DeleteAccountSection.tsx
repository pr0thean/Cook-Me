'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMyAccount } from '@/app/actions/account'
import { Dialog } from '@/components/molecules/Dialog'
import { useRefreshViewer } from '@/features/auth/viewer'

const dangerButtonClass =
  'cursor-pointer rounded-sm bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'

export function DeleteAccountSection() {
  const router = useRouter()
  const refreshViewer = useRefreshViewer()
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [isDeleting, startDelete] = useTransition()

  const handleDelete = () =>
    startDelete(async () => {
      setError(undefined)
      const result = await deleteMyAccount()

      if (result.error) {
        setError(result.error)
        return
      }

      await refreshViewer()
      router.replace('/')
    })

  return (
    <div className="space-y-3">
      <p className="text-blue-gray-dark text-sm">
        Permanently deletes your account, along with all your comments and photos.
      </p>

      <button type="button" onClick={() => setIsOpen(true)} className={dangerButtonClass}>
        Delete my account
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => !isDeleting && setIsOpen(open)}
        title="Delete your account?"
        description="Your account, comments and photos will be removed permanently. This cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="bg-gray-lighter hover:bg-gray-light cursor-pointer rounded-sm px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={dangerButtonClass}
          >
            {isDeleting ? 'Deleting...' : 'Delete permanently'}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-800">
            {error}
          </p>
        )}
      </Dialog>
    </div>
  )
}
