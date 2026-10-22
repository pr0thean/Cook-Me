import test, { expect } from '@playwright/test'

test.describe(`Login Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/login')
  })

  test('should show field errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Please enter a valid email.')).toBeVisible()
    await expect(page.getByText('Password is required.')).toBeVisible()
  })

  test('should hide field error once user edits that field', async ({ page }) => {
    // Clearing errors on input needs a hydrated form
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Please enter a valid email.')).toBeVisible()

    await page.getByLabel('Email address').fill('a')

    await expect(page.getByText('Please enter a valid email.')).toBeHidden()
    await expect(page.getByText('Password is required.')).toBeVisible()

    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Please enter a valid email.')).toBeVisible()
  })

  test('should show error for invalid email', async ({ page }) => {
    await page.getByLabel('Email address').fill('not-an-email')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Please enter a valid email.')).toBeVisible()
    await expect(page.getByText('Password is required.')).toBeHidden()
  })

  test('should show generic error and keep email on wrong credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('nobody@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Invalid email or password.')).toBeVisible()
    await expect(page.getByLabel('Email address')).toHaveValue('nobody@example.com')
    await expect(page.getByLabel('Password')).toHaveValue('')
  })
})
