import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonVariants = cva('w-full cursor-pointer rounded-sm px-4 py-2', {
  variants: {
    variant: {
      primary: 'bg-orange hover:bg-orange-dark text-off-black shadow-off-black/30 shadow-md',
      link: 'text-yellow bg-transparent underline',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonVariantsProps = VariantProps<typeof buttonVariants>

type Props = ComponentProps<'button'> &
  ButtonVariantsProps & {
    label: string
    link?: string | undefined
  }

export const Button = ({ label, link, variant = 'primary', className, ...props }: Props) => {
  const buttonClass = twMerge(buttonVariants({ variant }), className)

  const buttonTag = (
    <button {...props} className={buttonClass}>
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
