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
      className={clsx('w-full cursor-pointer rounded-sm px-4 py-2', {
        'bg-orange hover:bg-orange-dark text-off-black': variant === 'primary',
        'text-yellow bg-transparent underline': variant === 'link',
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
