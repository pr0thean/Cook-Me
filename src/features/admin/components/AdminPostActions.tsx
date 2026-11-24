'use client'

import clsx from 'clsx'
import { useEffect, useState, useTransition } from 'react'
import { markPostsSeen, setPostHidden } from '@/app/actions/adminPosts'
import { banUser } from '@/app/actions/adminUsers'
import { deletePost } from '@/app/actions/post'
import { useRefreshViewer } from '@/features/auth/viewer'

type Props = {
  postId: number
  hidden: boolean
  author: { id: number; name: string; canBan: boolean }
}

type Action = {
  label: string
  run: () => Promise<{ success: boolean; error?: string }>
  tone: 'danger' | 'neutral'
  confirm?: string
}

const toneClass: Record<Action['tone'], string> = {
  danger: 'bg-red-700 hover:bg-red-600',
  neutral: 'bg-blue-gray hover:brightness-110',
}

/** Hide/Unhide, Delete and Ban author buttons for one row of `/admin/posts` */
export function AdminPostActions({ postId, hidden, author }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()

  const actions: Action[] = [
    {
      label: hidden ? 'Unhide' : 'Hide',
      run: () => setPostHidden(postId, !hidden),
      tone: 'neutral',
    },
    {
      label: 'Delete',
      run: () => deletePost(postId),
      tone: 'danger',
      confirm: `Delete this comment by ${author.name} and its photos? This cannot be undone.`,
    },
  ]

  if (author.canBan) {
    actions.push({
      label: 'Ban author',
      run: () => banUser(author.id),
      tone: 'danger',
      confirm: `Ban ${author.name}? All their comments will be hidden until you unban them.`,
    })
  }

  const handleClick = (action: Action) => {
    if (action.confirm && !window.confirm(action.confirm)) return

    setError(undefined)
    startTransition(async () => {
      const result = await action.run()

      if (!result.success) setError(result.error ?? 'Something went wrong.')
    })
  }

  return (
    <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleClick(action)}
            disabled={isPending}
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

/**
 * Clears the "new posts" badge once the admin has opened the posts list. Done from the client after
 * mount, not while rendering, so a prefetch of the page can't mark posts as seen.
 */
export function MarkPostsSeen() {
  const refreshViewer = useRefreshViewer()

  useEffect(() => {
    markPostsSeen().then(refreshViewer, (error) => console.error('markPostsSeen failed:', error))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per visit
  }, [])

  return null
}
