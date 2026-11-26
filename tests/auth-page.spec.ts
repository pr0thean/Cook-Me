import test, { expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('tour-completed', 'true')
  })
})

test.describe(`Auth Page - login`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
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

  test('should switch to the sign-up form and back', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()

    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL(/\/auth\?mode=signup$/)
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()

    // Not the header's "Sign in" icon: the link next to "Already have an account?"
    await page.getByText('Already have an account?').getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/auth$/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })
})

test.describe(`Auth Page - next param`, () => {
  test('should keep a safe next path when switching modes', async ({ page }) => {
    await page.goto('/auth?next=/inspirations')

    await expect(page.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/auth?mode=signup&next=%2Finspirations'
    )
  })

  test('should drop a next path pointing to another site', async ({ page }) => {
    await page.goto('/auth?next=//evil.com')

    await expect(page.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/auth?mode=signup'
    )
  })
})

test.describe(`Auth Page - sign up`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth?mode=signup')
  })

  test('should show all field errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Please enter a valid email.')).toBeVisible()
    await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible()
    await expect(page.getByText('Display name is required.')).toBeVisible()
    await expect(page.getByText('You need to accept the privacy policy.')).toBeVisible()
  })

  test('should keep typed values (except the password) after a validation error', async ({
    page,
  }) => {
    await page.getByLabel('Email address').fill('new-cook@example.com')
    await page.getByLabel(/^Password/).fill('short')
    await page.getByLabel(/^Display name/).fill('Anna K.')
    await page.getByLabel(/Why do you want to join/).fill('I love cooking')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible()
    await expect(page.getByText('You need to accept the privacy policy.')).toBeVisible()
    await expect(page.getByText('Please enter a valid email.')).toBeHidden()
    await expect(page.getByText('Display name is required.')).toBeHidden()

    await expect(page.getByLabel('Email address')).toHaveValue('new-cook@example.com')
    await expect(page.getByLabel(/^Display name/)).toHaveValue('Anna K.')
    await expect(page.getByLabel(/Why do you want to join/)).toHaveValue('I love cooking')
    await expect(page.getByLabel(/^Password/)).toHaveValue('')
  })

  test('should hide the consent error once the checkbox is ticked', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByText('You need to accept the privacy policy.')).toBeVisible()

    await page.getByRole('checkbox').check()

    await expect(page.getByText('You need to accept the privacy policy.')).toBeHidden()
  })

  test('should link to the privacy policy in a new tab', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: 'privacy policy' })

    await expect(privacyLink).toHaveAttribute('href', '/privacy')
    await expect(privacyLink).toHaveAttribute('target', '_blank')
  })
})

test.describe(`Auth Page - forgot password`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Forgot password?' }).click()
  })

  test('should open and close the dialog', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Reset password' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toBeHidden()
  })

  test('should validate the email', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Reset password' })

    await dialog.getByRole('button', { name: 'Send reset link' }).click()
    await expect(dialog.getByText('Please enter a valid email.')).toBeVisible()

    await dialog.getByLabel('Email address').fill('not-an-email')
    await dialog.getByRole('button', { name: 'Send reset link' }).click()
    await expect(dialog.getByText('Please enter a valid email.')).toBeVisible()
  })

  test('should start with an empty form after reopening', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Reset password' })

    await dialog.getByRole('button', { name: 'Send reset link' }).click()
    await expect(dialog.getByText('Please enter a valid email.')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    await page.getByRole('button', { name: 'Forgot password?' }).click()
    await expect(dialog.getByText('Please enter a valid email.')).toBeHidden()
  })
})

test('should explain an expired reset link when signed out', async ({ page }) => {
  await page.goto('/auth?dialog=reset-password')

  await expect(page.getByText('Your password reset link has expired.')).toBeVisible()
  await expect(page.getByRole('dialog')).toBeHidden()
})
