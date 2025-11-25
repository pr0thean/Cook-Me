import { Difficulty as DifficultyType } from '@prisma/client'
import clsx from 'clsx'

export const Difficulty = ({
  difficulty,
  isWhite,
}: {
  difficulty: DifficultyType
  isWhite?: boolean
}) => {
  return (
    <span
      className={clsx('', {
        'text-green': difficulty === DifficultyType.EASY,
        'text-gray': !isWhite && difficulty === DifficultyType.MEDIUM,
        'text-white': isWhite && difficulty === DifficultyType.MEDIUM,
        'text-orange': difficulty === DifficultyType.HARD,
      })}
    >
      {difficulty}
    </span>
  )
}
