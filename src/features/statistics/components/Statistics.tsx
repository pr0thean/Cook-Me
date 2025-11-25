import { getStatisticsData } from 'app/actions/getStatisticsData'
import { RecipesList } from 'features/recipes/components/RecipesList'
import StatisticsCard from './StatisticsCard'

export default async function Statistics() {
  const { recentRecipes, mostPopularCategory, stats } = await getStatisticsData()

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <StatisticsCard value={stats.totalRecipes} label="Recipes" />

        <StatisticsCard value={stats.totalCategories} label="Categories" />

        {mostPopularCategory && (
          <StatisticsCard
            value={mostPopularCategory}
            label={`Most Popular`}
            extraInfo={`(${stats.mostPopularCategoryRecipeCount} recipes)`}
          />
        )}
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold text-white">Recent Recipes</h2>

        {recentRecipes.length === 0 ? (
          <div className="text-yellow text-center">No recipes yet</div>
        ) : (
          <RecipesList recipes={recentRecipes} />
        )}
      </div>
    </>
  )
}
