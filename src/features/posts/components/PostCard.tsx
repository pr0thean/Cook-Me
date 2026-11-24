'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { DropdownMenu } from 'radix-ui'
import { deletePost, editPost } from '@/app/actions/post'
import { setPostHidden } from '@/app/actions/adminPosts'
import type { Viewer } from '@/features/auth/viewer'
import { POST_CONTENT_MAX_LENGTH, type PostActionResult, type PostData } from '../types'
import { PhotoViewer } from './PhotoViewer'
import { RelativeTime } from './RelativeTime'

type Props = {
  post: PostData
  viewer: Viewer | undefined
  /** Called after an edit, delete or hide succeeded */
  onChanged: () => Promise<unknown>
}

const itemClass =
  'cursor-pointer rounded-sm px-3 py-2 outline-none data-highlighted:bg-blue-gray data-disabled:opacity-50'

const gridClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

/** One post: author, date, text, photos, and a ⋯ menu for its author (edit/delete) and the admin (hide/delete) */
export function PostCard({ post, viewer, onChanged }: Props) {
  const [openPhotoIndex, setOpenPhotoIndex] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(post.content ?? '')
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  const isAuthor = viewer?.id === post.author.id
  const isAdmin = viewer?.role === 'ADMIN'
  const canEdit = isAuthor && viewer?.status === 'APPROVED'

  const run = (action: () => Promise<PostActionResult>, onSuccess?: () => void) => {
    setError(undefined)
    startTransition(async () => {
      try {
        const result = await action()

        if (!result.success) {
          setError(result.error)
          return
        }
      } catch (actionError) {
        console.error(actionError)
        setError('Something went wrong. Please try again.')
        return
      }

      onSuccess?.()
      await onChanged()
    })
  }

  const handleDelete = () => {
    const question = isAuthor
      ? 'Delete your comment? Its photos will be removed too.'
      : `Delete ${post.author.name}'s comment and its photos?`

    if (window.confirm(question)) run(() => deletePost(post.id))
  }

  const handleSave = () =>
    run(
      () => editPost(post.id, draft),
      () => setIsEditing(false)
    )

  const startEditing = () => {
    setDraft(post.content ?? '')
    setError(undefined)
    setIsEditing(true)
  }

  return (
    <article
      id={`post-${post.id}`}
      className={clsx(
        'border-gray-lighter scroll-mt-20 space-y-3 border-b pb-5',
        isPending && 'opacity-60'
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold">{post.author.name}</span>
          <RelativeTime date={post.createdAt} className="text-blue-gray text-sm" />
          {post.editedAt && <span className="text-blue-gray text-xs">(edited)</span>}
        </div>

        {(isAuthor || isAdmin) && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              aria-label="Comment options"
              disabled={isPending}
              className="text-blue-gray cursor-pointer rounded-sm p-1 outline-none hover:text-black focus-visible:ring-2"
            >
              <EllipsisHorizontalIcon className="h-6 w-6" strokeWidth={2} />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="bg-blue-gray-dark border-blue-gray z-30 min-w-36 rounded-sm border p-1 text-white shadow-lg"
              >
                {canEdit && (
                  <DropdownMenu.Item className={itemClass} onSelect={startEditing}>
                    Edit
                  </DropdownMenu.Item>
                )}
                {isAdmin && (
                  <DropdownMenu.Item
                    className={itemClass}
                    onSelect={() => run(() => setPostHidden(post.id, true))}
                  >
                    Hide
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  className={clsx(itemClass, 'text-red-300')}
                  onSelect={handleDelete}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </header>

      {isEditing ? (
        <div className="space-y-2">
          <label htmlFor={`edit-post-${post.id}`} className="sr-only">
            Edit your comment
          </label>
          <textarea
            id={`edit-post-${post.id}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={POST_CONTENT_MAX_LENGTH}
            rows={3}
            autoFocus
            className="border-gray w-full rounded-sm border bg-white px-4 py-2 text-base text-black focus:outline-hidden"
          />
          <div className="flex items-center justify-end gap-2">
            <span className="text-blue-gray mr-auto text-xs">
              {draft.length}/{POST_CONTENT_MAX_LENGTH}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="bg-gray-lighter hover:bg-gray-light cursor-pointer rounded-sm px-4 py-1.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="bg-orange hover:bg-orange-dark text-off-black cursor-pointer rounded-sm px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        post.content && <p className="wrap-break-word whitespace-pre-line">{post.content}</p>
      )}

      {post.images.length > 0 && (
        <div className={clsx('grid max-w-xl gap-2', gridClass[post.images.length])}>
          {post.images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenPhotoIndex(index)}
              aria-label="Open photo"
              className={clsx(
                'relative cursor-pointer overflow-hidden rounded-md',
                post.images.length === 1 ? 'aspect-4/3' : 'aspect-square'
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes={
                  post.images.length === 1
                    ? '(min-width: 768px) 576px, 90vw'
                    : '(min-width: 768px) 190px, 30vw'
                }
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <PhotoViewer
        images={post.images}
        index={openPhotoIndex}
        onIndexChange={setOpenPhotoIndex}
        title={`Photo by ${post.author.name}`}
      />
    </article>
  )
}
