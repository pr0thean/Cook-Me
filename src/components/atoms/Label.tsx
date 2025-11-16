import { Label as LabelPrimitive } from 'radix-ui'

type Props = {
  name: string
  label: string
}

export const Label = ({ name, label }: Props) => {
  return (
    <LabelPrimitive.Root htmlFor={name} className="cursor-pointer text-sm text-white">
      {label}
    </LabelPrimitive.Root>
  )
}
