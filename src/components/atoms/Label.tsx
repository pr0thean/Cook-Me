import { Label as LabelPrimitive } from 'radix-ui'
import type { LabelProps } from '@radix-ui/react-label'
import { twMerge } from 'tailwind-merge'

type Props = LabelProps & {
  name: string
  label: string
}

export const Label = ({ name, label, className, ...props }: Props) => {
  return (
    <LabelPrimitive.Root
      htmlFor={name}
      className={twMerge('cursor-pointer text-sm', className)}
      {...props}
    >
      {label}
    </LabelPrimitive.Root>
  )
}
