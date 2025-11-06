import { Difficulty } from '@prisma/client'
import clsx from 'clsx'

export const Level = ({ level, isWhite }: { level: Difficulty; isWhite?: boolean }) => {
  return (
    <span
      className={clsx('', {
        'text-green': level === Difficulty.EASY,
        'text-gray': !isWhite && level === Difficulty.MEDIUM,
        'text-white': isWhite && level === Difficulty.MEDIUM,
        'text-orange': level === Difficulty.HARD,
      })}
    >
      {level}
    </span>
  )
}
