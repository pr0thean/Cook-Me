import { twMerge } from 'tailwind-merge'
import { Label } from './Label'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  error?: string
}

/** Multi-line text field matching `TextInput`'s secondary (light background) style */
export const TextArea = ({ name, label, error, className, ...props }: Props) => {
  const errorId = `${name}-error`

  return (
    <div className="flex flex-col gap-1 text-left">
      {label && <Label name={name} label={label} className="text-black" />}

      <textarea
        id={name}
        name={name}
        className={twMerge(
          'border-gray w-full rounded-sm border bg-white px-4 py-2 text-base text-black focus:outline-hidden',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />

      {error && (
        <span id={errorId} role="alert" className="text-sm text-red-700">
          {error}
        </span>
      )}
    </div>
  )
}
