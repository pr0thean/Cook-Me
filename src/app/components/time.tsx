import clsx from 'clsx'

export const Time = ({ time, isWhite }: { time: number; isWhite?: boolean }) => {
  return (
    <span
      className={clsx('', {
        'text-green': time <= 30,
        'text-gray': !isWhite && time > 30 && time <= 60,
        'text-white': isWhite && time > 30 && time <= 60,
        'text-orange': time > 60,
      })}
    >
      {time} min
    </span>
  )
}
