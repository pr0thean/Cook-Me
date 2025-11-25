import { RecipeCard } from '@/features/recipes/components/RecipeCard'
import { Recipe } from '@/types/prisma-types'

type Props = {
  recipes: Recipe[]
}

export const RecipesList = ({ recipes }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} data={recipe} />
      ))}
    </div>
  )
}
