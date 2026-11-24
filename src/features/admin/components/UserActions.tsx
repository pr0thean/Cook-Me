'use client'

import clsx from 'clsx'
import { useState, useTransition } from 'react'
import { approveUser, banUser, deleteUser, unbanUser } from '@/app/actions/adminUsers'
import { useRefreshViewer } from '@/features/auth/viewer'
import type { UserStatus } from '@/generated/prisma/client'

type Props = {
  userId: number
  userName: string
  status: UserStatus
  emailConfirmed: boolean
}

type Action = {
  label: string
  run: (userId: number) => Promise<{ success: boolean; error?: string }>
  tone: 'primary' | 'danger' | 'neutral'
  /** Asked with `confirm()` before running */
  confirm?: string
  disabled?: boolean
  title?: string
}

const toneClass: Record<Action['tone'], string> = {
  primary: 'bg-green hover:brightness-110',
  danger: 'bg-red-700 hover:bg-red-600',
  neutral: 'bg-blue-gray hover:brightness-110',
}

/** Approve/Reject (pending), Ban (approved), Unban/Delete (banned) buttons for one user row */
export function UserActions({ userId, userName, status, emailConfirmed }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const refreshViewer = useRefreshViewer()

  const actionsByStatus: Record<UserStatus, Action[]> = {
    PENDING: [
      {
        label: 'Approve',
        run: approveUser,
        tone: 'primary',
        disabled: !emailConfirmed,
        title: emailConfirmed ? undefined : 'Waiting for the user to confirm their email',
      },
      {
        label: 'Reject',
        run: deleteUser,
        tone: 'danger',
        confirm: `Reject ${userName}? Their sign-up will be deleted (they can sign up again).`,
      },
    ],
    APPROVED: [
      {
        label: 'Ban',
        run: banUser,
        tone: 'danger',
        confirm: `Ban ${userName}? All their comments will be hidden until you unban them.`,
      },
    ],
    BANNED: [
      { label: 'Unban', run: unbanUser, tone: 'neutral' },
      {
        label: 'Delete',
        run: deleteUser,
        tone: 'danger',
        confirm: `Permanently delete ${userName}'s account and all their comments? This cannot be undone.`,
      },
    ],
  }

  const handleClick = (action: Action) => {
    if (action.confirm && !window.confirm(action.confirm)) return

    setError(undefined)
    startTransition(async () => {
      const result = await action.run(userId)

      if (!result.success) {
        setError(result.error ?? 'Something went wrong.')
        return
      }

      // The header badge counts pending users
      await refreshViewer()
    })
  }

  return (
    <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
      <div className="flex gap-2">
        {actionsByStatus[status].map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleClick(action)}
            disabled={isPending || action.disabled}
            title={action.title}
            className={clsx(
              'cursor-pointer rounded-sm px-3 py-1.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50',
              toneClass[action.tone]
            )}
          >
            {action.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
