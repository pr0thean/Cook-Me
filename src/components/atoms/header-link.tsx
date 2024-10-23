import clsx from 'clsx'
import Link from 'next/link'

type Props = {
  href: string
  label: string
  isSelected: boolean
}

export const HeaderLink = ({ href, label, isSelected }: Props) => {
  return (
    <Link
      href={href}
      className={clsx('text-xl font-bold hover:text-orange sm:text-2xl', {
        'text-orange': isSelected,
      })}
    >
      {label}
    </Link>
  )
}
