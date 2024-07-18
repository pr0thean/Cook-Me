import clsx from 'clsx'
import Link from 'next/link'

type Props = {
  label: string
  link?: string | undefined
  variant?: 'primary' | 'link'
}

const Button = ({ label, link, variant = 'primary' }: Props) => {
  const buttonTag = (
    <button
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

export default Button
