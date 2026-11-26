import test, { expect } from '@playwright/test'

test.describe(`Auth Confirm Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
  })

  test('should show "Invalid link" without a token', async ({ page }) => {
    await page.goto('/auth/confirm')

    await expect(page.getByRole('heading', { name: 'Invalid link' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'go to sign in' })).toHaveAttribute('href', '/auth')
  })

  test('should show "Invalid link" for an unknown link type', async ({ page }) => {
    await page.goto('/auth/confirm?token_hash=abc&type=magiclink')

    await expect(page.getByRole('heading', { name: 'Invalid link' })).toBeVisible()
  })

  test('should wait for a click before confirming a sign-up', async ({ page }) => {
    await page.goto('/auth/confirm?token_hash=abc&type=email')

    await expect(page.getByRole('heading', { name: 'Confirm your email' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirm my email' })).toBeEnabled()
  })

  test('should wait for a click before a password reset', async ({ page }) => {
    await page.goto('/auth/confirm?token_hash=abc&type=recovery')

    await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  test('should show an error for an invalid token', async ({ page }) => {
    await page.goto('/auth/confirm?token_hash=not-a-real-token&type=email')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Confirm my email' }).click()

    await expect(page.getByText('This link is invalid or has expired.')).toBeVisible()
    // exact: not the header's "Sign in" icon
    await expect(page.getByRole('link', { name: 'sign in', exact: true })).toHaveAttribute(
      'href',
      '/auth'
    )
    await expect(page).toHaveURL(/\/auth\/confirm/)
  })
})
