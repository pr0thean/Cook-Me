import { Label } from 'radix-ui'

type Props = {
  name: string
  accept?: string
}

export const FileInput = ({ name, accept }: Props) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label.Root htmlFor={name} className="cursor-pointer text-sm text-white">
        Upload File
      </Label.Root>

      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        className="placeholder:text-blue-gray bg-blue-gray-dark border-blue-gray data-placeholder:text-gray w-full cursor-pointer rounded border px-3 py-2 text-white outline-none focus:border-white data-[state=open]:border-white"
      />
    </div>
  )
}
