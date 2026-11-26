import test, { expect } from '@playwright/test'

/** Signed-out visitors are sent to sign in, with a way back to the page they wanted */
test.describe(`Protected pages (signed out)`, () => {
  const cases = [
    { path: '/account', next: '%2Faccount' },
    { path: '/admin', next: '%2Fadmin' },
    { path: '/admin/users', next: '%2Fadmin%2Fusers' },
    { path: '/admin/posts', next: '%2Fadmin%2Fposts' },
  ]

  for (const { path, next } of cases) {
    test(`${path} redirects to sign in`, async ({ page }) => {
      await page.goto(path)

      await expect(page).toHaveURL(new RegExp(`/auth\\?next=${next}$`))
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    })
  }
})
