import { expect, test } from '@playwright/experimental-ct-react'
import { PhotoViewerStory } from './PhotoViewer.story'

test.describe('<PhotoViewer />', () => {
  test('is closed when no photo is selected', async ({ mount, page }) => {
    await mount(<PhotoViewerStory imageCount={3} initialIndex={null} />)

    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('shows a single photo without navigation', async ({ mount, page }) => {
    await mount(<PhotoViewerStory imageCount={1} initialIndex={0} />)

    const dialog = page.getByRole('dialog', { name: 'Photo by Anna' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Previous photo' })).toHaveCount(0)
    await expect(dialog.getByRole('button', { name: 'Next photo' })).toHaveCount(0)
    await expect(dialog.getByText('1 / 1')).toHaveCount(0)
  })

  test('moves with the buttons, hiding them at the ends', async ({ mount, page }) => {
    const component = await mount(<PhotoViewerStory imageCount={3} initialIndex={0} />)
    const dialog = page.getByRole('dialog')
    const prev = dialog.getByRole('button', { name: 'Previous photo' })
    const next = dialog.getByRole('button', { name: 'Next photo' })

    await expect(dialog.getByText('1 / 3')).toBeVisible()
    await expect(prev).toBeHidden()

    await next.click()
    await expect(dialog.getByText('2 / 3')).toBeVisible()
    await expect(prev).toBeVisible()

    await next.click()
    await expect(dialog.getByText('3 / 3')).toBeVisible()
    await expect(next).toBeHidden()
    await expect(component.getByLabel('Open index')).toHaveText('2')

    await prev.click()
    await expect(dialog.getByText('2 / 3')).toBeVisible()
  })

  test('moves with the arrow keys and stops at the ends', async ({ mount, page }) => {
    const component = await mount(<PhotoViewerStory imageCount={2} initialIndex={0} />)
    const openIndex = component.getByLabel('Open index')

    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('ArrowLeft')
    await expect(openIndex).toHaveText('0')

    await page.keyboard.press('ArrowRight')
    await expect(openIndex).toHaveText('1')

    await page.keyboard.press('ArrowRight')
    await expect(openIndex).toHaveText('1')

    await page.keyboard.press('ArrowLeft')
    await expect(openIndex).toHaveText('0')
  })

  test('closes with the close button', async ({ mount, page }) => {
    const component = await mount(<PhotoViewerStory imageCount={2} initialIndex={1} />)
    const dialog = page.getByRole('dialog')

    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toBeHidden()
    await expect(component.getByLabel('Open index')).toHaveText('closed')
  })

  test('closes with Escape', async ({ mount, page }) => {
    const component = await mount(<PhotoViewerStory imageCount={2} initialIndex={0} />)
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(component.getByLabel('Open index')).toHaveText('closed')
  })

  test('shows a caption and can hide the counter', async ({ mount, page }) => {
    await mount(
      <PhotoViewerStory
        imageCount={3}
        initialIndex={1}
        caption="Pancakes — go to recipe →"
        showCount={false}
      />
    )

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Pancakes — go to recipe →')).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Next photo' })).toBeVisible()
    await expect(dialog.getByText('2 / 3')).toHaveCount(0)
  })
})
