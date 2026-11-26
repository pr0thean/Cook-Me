import test, { expect, type Page } from '@playwright/test'

/** The wall's photo buttons ("Open photo of {recipe} by {author}") */
const photoButtons = (page: Page) => page.getByRole('button', { name: /^Open photo of / })

test.describe(`Inspirations Page`, () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto('/inspirations')
  })

  test('should display page title and mark the nav link as current', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inspirations' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inspirations', exact: true })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  test('should show photos or an empty state', async ({ page }) => {
    const emptyState = page.getByText('No photos yet.')

    await expect(photoButtons(page).first().or(emptyState)).toBeVisible()
  })

  test('should send the sign-in link back to this page', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/auth?next=%2Finspirations'
    )
  })

  test.describe('photo viewer', () => {
    test.beforeEach(async ({ page }) => {
      if ((await photoButtons(page).count()) === 0) {
        test.skip(true, 'No community photos yet')
      }
    })

    test('opens a photo with its author and a link to the comment', async ({ page }) => {
      const firstPhoto = photoButtons(page).first()
      // "Open photo of {recipe} by {author}" names the viewer "{recipe} by {author}"
      const label = (await firstPhoto.getAttribute('aria-label'))!.replace(/^Open photo of /, '')

      await firstPhoto.click()

      const viewer = page.getByRole('dialog', { name: label })
      await expect(viewer).toBeVisible()
      await expect(viewer.getByRole('link', { name: /go to recipe →/ })).toHaveAttribute(
        'href',
        /^\/recipes\/[^/#]+#post-\d+$/
      )
      await expect(viewer.getByRole('button', { name: 'Previous photo' })).toBeHidden()

      await page.keyboard.press('Escape')
      await expect(viewer).toBeHidden()
    })

    test('moves between photos with the arrow keys', async ({ page }) => {
      if ((await photoButtons(page).count()) < 2) {
        test.skip(true, 'Needs at least two photos')
      }

      const [first, second] = await Promise.all(
        [0, 1].map(async (index) =>
          (await photoButtons(page).nth(index).getAttribute('aria-label'))!.replace(
            /^Open photo of /,
            ''
          )
        )
      )

      await photoButtons(page).first().click()
      await expect(page.getByRole('dialog', { name: first })).toBeVisible()

      await page.keyboard.press('ArrowRight')
      await expect(page.getByRole('dialog', { name: second })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Previous photo' })).toBeVisible()

      await page.getByRole('button', { name: 'Previous photo' }).click()
      await expect(page.getByRole('dialog', { name: first })).toBeVisible()
    })

    test('"go to recipe" opens the comment on the recipe page', async ({ page }) => {
      await photoButtons(page).first().click()

      const goToRecipe = page.getByRole('dialog').getByRole('link', { name: /go to recipe →/ })
      const href = (await goToRecipe.getAttribute('href'))!
      const postAnchor = href.slice(href.indexOf('#') + 1)

      await goToRecipe.click()

      await expect(page).toHaveURL(new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))
      await expect(page.locator(`[id="${postAnchor}"]`)).toBeInViewport()
    })
  })
})
