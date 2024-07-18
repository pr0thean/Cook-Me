import { RecipeFields } from '@services/getRecipes'
import RecipeCard from '@app/components/recipe-card'

type Props = {
  recipes: RecipeFields[]
}

const RecipesList = ({ recipes }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 md:gap-6 md:px-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.slug} data={recipe} />
      ))}
    </div>
  )
}

export default RecipesList
