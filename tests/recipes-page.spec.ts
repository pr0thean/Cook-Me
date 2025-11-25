import test, { expect } from '@playwright/test'

test.describe(`Recipes Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/recipes')
  })

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Recipes/i })).toBeVisible()
  })

  test('render filters', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search recipes.../i)).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'category' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'tag' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'difficulty' })).toBeVisible()
  })
})
