import clsx from 'clsx'

export const Level = ({
  level,
  isWhite,
}: {
  level: 'Easy' | 'Average' | 'Hard'
  isWhite?: boolean
}) => {
  return (
    <span
      className={clsx('', {
        'text-green': level === 'Easy',
        'text-gray': !isWhite && level === 'Average',
        'text-white': isWhite && level === 'Average',
        'text-orange': level === 'Hard',
      })}
    >
      {level}
    </span>
  )
}
