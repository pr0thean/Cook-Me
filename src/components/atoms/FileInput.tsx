import { Label } from './Label'

type Props = {
  name: string
  accept?: string
}

export const FileInput = ({ name, accept }: Props) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Label name={name} label="Upload File" />

      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        className="placeholder:text-blue-gray bg-blue-gray-dark border-blue-gray data-placeholder:text-gray w-full cursor-pointer rounded border px-3 py-2 text-white outline-none focus:border-white"
      />
    </div>
  )
}
