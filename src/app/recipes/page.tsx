import Hero from '@app/components/hero'
import { getPage } from '@services/getPage'
import { getRecipes } from '@services/getRecipes'
import RecipesList from '@app/components/recipes-list'

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page = await getPage('recipes')
  const recipes = await getRecipes(
    typeof searchParams.search === 'string' ? searchParams.search : undefined
  )

  const hero = page.hero

  return (
    <div className="space-y-4 md:space-y-6">
      {hero && <Hero image={hero.fields.image} heading={hero.fields.heading} />}

      <RecipesList recipes={recipes} />
    </div>
  )
}
