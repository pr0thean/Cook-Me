import test, { expect } from '@playwright/test'

test.describe(`About Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/about')
  })

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /About Cook Me/i })).toBeVisible()
  })
})
