import clsx from 'clsx'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

type Props = {
  href: string
  label: string
  /** Shown instead of the label on small screens, where four text links don't fit next to the icons */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  isSelected: boolean
}

/** A main navigation link: an icon on small screens, the text label from `md` up */
export const HeaderLink = ({ href, label, icon: Icon, isSelected }: Props) => {
  return (
    <Link
      href={href}
      title={label}
      aria-current={isSelected ? 'page' : undefined}
      className={clsx(
        'hover:text-orange flex h-7 items-center text-xl font-bold tracking-wider lg:text-2xl',
        { 'text-orange': isSelected }
      )}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:hidden" strokeWidth={2} aria-hidden />
      <span className="sr-only md:not-sr-only">{label}</span>
    </Link>
  )
}
