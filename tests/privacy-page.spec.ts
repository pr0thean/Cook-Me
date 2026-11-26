import test, { expect } from '@playwright/test'

test.describe(`Privacy Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/privacy')
  })

  test('should display the policy sections', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeVisible()

    for (const name of [
      'What we store',
      'Why',
      'Where it is stored',
      'How long',
      'Deleting your data',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible()
    }
  })

  test('should link to the account page to delete data', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'My account' })).toHaveAttribute('href', '/account')
  })
})
