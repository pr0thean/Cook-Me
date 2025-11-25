type Props = {
  value: string | number
  label: string
  extraInfo?: string
}

export default function StatisticsCard({ value, label, extraInfo }: Props) {
  return (
    <div className="bg-blue-gray-dark shadow-off-black/30 flex flex-col items-center gap-1 rounded-lg p-4 text-center shadow-md">
      <span className="text-orange text-xl font-bold sm:text-2xl md:text-3xl">{value}</span>

      <div className="flex gap-1">
        <span className="text-gray text-xs sm:text-sm">{label}</span>
        {extraInfo && <span className="text-gray hidden text-sm md:block">{extraInfo}</span>}
      </div>
    </div>
  )
}
