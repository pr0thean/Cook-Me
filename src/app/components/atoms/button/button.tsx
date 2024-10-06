import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps } from 'react'

type Props = ComponentProps<'button'> & {
  label: string
  link?: string | undefined
  variant?: 'primary' | 'link'
}

export const Button = ({ label, link, variant = 'primary', ...props }: Props) => {
  const buttonTag = (
    <button
      {...props}
      className={clsx('w-full rounded px-4 py-2', {
        'bg-orange text-off-black': variant === 'primary',
        'bg-transparent text-yellow underline': variant === 'link',
      })}
    >
      {label}
    </button>
  )

  if (link) {
    return (
      <Link href={link} className="w-full">
        {buttonTag}
      </Link>
    )
  }

  return buttonTag
}
