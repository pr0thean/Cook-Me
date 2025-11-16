import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { Label } from './Label'

const inputVariants = cva('w-full rounded-sm border focus:outline-hidden ', {
  variants: {
    variant: {
      primary: 'border-gray  text-white bg-black/80',
      secondary: 'text-black bg-white border-gray',
    },
    inputSize: {
      md: 'text-base px-4 py-2',
      lg: 'text-base px-6 py-3',
    },
    isIcon: {
      true: 'pl-10',
    },
  },
  defaultVariants: {
    variant: 'primary',
    inputSize: 'md',
  },
})

type InputVariantProps = VariantProps<typeof inputVariants>

interface Props extends React.InputHTMLAttributes<HTMLInputElement>, InputVariantProps {
  name: string
  label?: string
  error?: string
  className?: string
  icon?: React.ReactNode
}

export const TextInput = ({
  name,
  label,
  error,
  variant,
  inputSize,
  onChange,
  className,
  icon,
  ...props
}: Props) => {
  const inputClass = inputVariants({ variant, inputSize, isIcon: !!icon })
  const errorId = `${name}-error`

  return (
    <div className="flex flex-col gap-1">
      {label && <Label name={name} label={label} />}

      <div className="relative">
        <input
          id={name}
          name={name}
          className={twMerge(inputClass, className)}
          onChange={onChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />

        {icon && <div className="absolute top-3.5 left-2.5">{icon}</div>}
      </div>

      {error && (
        <span id={errorId} role="alert" className="text-sm text-red-100">
          {error}
        </span>
      )}
    </div>
  )
}
