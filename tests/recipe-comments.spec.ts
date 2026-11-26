import test, { expect } from '@playwright/test'

const POSTS_PER_PAGE = 10

test.describe(`Recipe Page - comments (signed out)`, () => {
  let slug: string

  test.beforeEach(async ({ page, request }) => {
    // Any recipe will do: the assertions only rely on what the page says about itself.
    // Prefer one with comment photos (the newest on Inspirations) so the viewer gets covered too.
    const { photos } = await (await request.get('/api/inspirations')).json()
    const { recipes } = await (await request.get('/api/recipes?take=1')).json()
    const candidate: string | undefined = photos[0]?.recipe.slug ?? recipes[0]?.slug

    if (!candidate) {
      test.skip(true, 'No recipes in the database')
    }

    slug = candidate!

    await page.addInitScript(() => {
      window.localStorage.setItem('tour-completed', 'true')
    })
    await page.goto(`/recipes/${slug}`)
  })

  test('should invite signed-out visitors to sign in and come back', async ({ page }) => {
    const signIn = page.getByRole('link', { name: 'Sign in to share your version' })

    await expect(signIn).toBeVisible()
    await expect(signIn).toHaveAttribute(
      'href',
      `/auth?next=${encodeURIComponent(`/recipes/${slug}`)}`
    )

    // No composer and no comment menus without an account
    await expect(page.getByPlaceholder('How did it go? Any changes you made?')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Comment options' })).toHaveCount(0)
  })

  test('should render the first page of comments matching the count', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /^Comments \(\d+\)$/ })
    await expect(heading).toBeVisible()

    const count = Number(/\((\d+)\)/.exec((await heading.textContent())!)![1])
    const section = page.locator('section#posts')
    const posts = section.locator('article[id^="post-"]')

    if (count === 0) {
      await expect(section.getByText('No comments yet.')).toBeVisible()
      await expect(posts).toHaveCount(0)
    } else {
      await expect(posts).toHaveCount(Math.min(count, POSTS_PER_PAGE))
    }

    const loadMore = section.getByRole('button', { name: 'Load more' })
    await expect(loadMore).toHaveCount(count > POSTS_PER_PAGE ? 1 : 0)
  })

  test('"Load more" adds the next page of comments', async ({ page }) => {
    const loadMore = page.getByRole('button', { name: 'Load more' })

    if ((await loadMore.count()) === 0) {
      test.skip(true, `Recipe has ${POSTS_PER_PAGE} comments or fewer`)
    }

    const posts = page.locator('section#posts article[id^="post-"]')
    await expect(posts).toHaveCount(POSTS_PER_PAGE)

    await loadMore.click()

    await expect.poll(() => posts.count()).toBeGreaterThan(POSTS_PER_PAGE)
  })

  test('should open a comment photo in the viewer', async ({ page }) => {
    const openPhoto = page.locator('section#posts').getByRole('button', { name: 'Open photo' })

    if ((await openPhoto.count()) === 0) {
      test.skip(true, 'No comment photos on this recipe')
    }

    await openPhoto.first().click()

    const viewer = page.getByRole('dialog')
    await expect(viewer).toBeVisible()

    await viewer.getByRole('button', { name: 'Close' }).click()
    await expect(viewer).toBeHidden()
  })
})
