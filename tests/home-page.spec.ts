import test, { expect } from '@playwright/test'

test.describe(`Home Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/')
  })

  test('should display header links', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /Home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')

    const nav = homeLink.locator('..')
    await expect(nav.getByRole('link', { name: /Recipes/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /Recipes/i })).toHaveAttribute('href', '/recipes')

    await expect(nav.getByRole('link', { name: /About/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /About/i })).toHaveAttribute('href', '/about')
  })

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Cook Me/i })).toBeVisible()
  })

  test('can open and hide search form', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search recipes.../i)).not.toBeVisible()

    await page.getByLabel('Open search').click()
    await expect(page.getByPlaceholder(/Search recipes.../i)).toBeVisible()

    await page.getByRole('heading', { name: /Cook Me/i }).click()
    await expect(page.getByPlaceholder(/Search recipes.../i)).not.toBeVisible()
  })

  test('can click "Browse recipes" button and navigate to Recipes Page', async ({ page }) => {
    await page.getByRole('button', { name: '>> Browse all recipes <<' }).click()
    await expect(page).toHaveURL(/\/recipes/)
  })
})
