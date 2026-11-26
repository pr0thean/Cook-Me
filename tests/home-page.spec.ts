import test, { expect } from '@playwright/test'

test.describe(`Home Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/')
  })

  test('should display header links', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Home', exact: true })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')
    await expect(homeLink).toHaveAttribute('aria-current', 'page')

    const nav = homeLink.locator('..')
    const links = [
      { name: 'Recipes', href: '/recipes' },
      { name: 'Inspirations', href: '/inspirations' },
      { name: 'About', href: '/about' },
    ]

    for (const { name, href } of links) {
      const link = nav.getByRole('link', { name, exact: true })

      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute('href', href)
      await expect(link).not.toHaveAttribute('aria-current', 'page')
    }
  })

  test('should show a sign-in link for signed-out visitors', async ({ page }) => {
    const signIn = page.getByRole('link', { name: 'Sign in' })

    await expect(signIn).toBeVisible()
    await expect(signIn).toHaveAttribute('href', '/auth?next=%2F')

    await signIn.click()
    await expect(page).toHaveURL(/\/auth\?next=%2F$/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
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

  test('community photos strip links to comments and to Inspirations', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Latest from the community' })

    // The strip is hidden while nobody has shared a photo
    if ((await heading.count()) === 0) {
      test.skip(true, 'No community photos yet')
    }

    const section = page.locator('section', { has: heading })

    await expect(section.getByRole('link', { name: 'See all →' })).toHaveAttribute(
      'href',
      '/inspirations'
    )

    const photoLinks = section.getByRole('listitem').getByRole('link')
    const count = await photoLinks.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(6)

    for (const link of await photoLinks.all()) {
      await expect(link).toHaveAttribute('href', /^\/recipes\/[^/#]+#post-\d+$/)
    }
  })
})
