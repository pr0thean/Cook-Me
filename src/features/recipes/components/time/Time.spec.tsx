import { test, expect } from '@playwright/experimental-ct-react'
import { Time } from './Time'

test.describe('<Time />', () => {
  test('renders green text when time <= 30', async ({ mount }) => {
    const component = await mount(<Time time={30} />)
    const text = component.getByText('30 min')
    await expect(text).toBeVisible()
    await expect(text).toHaveClass(/text-green/)
  })

  test('renders gray text when time > 30 && time <= 60', async ({ mount }) => {
    const component = await mount(<Time time={45} />)
    const text = component.getByText('45 min')
    await expect(text).toBeVisible()
    await expect(text).toHaveClass(/text-gray/)
  })

  test('renders white text when time > 30 && time <= 60 and isWhite prop is provided', async ({
    mount,
  }) => {
    const component = await mount(<Time time={45} isWhite />)
    const text = component.getByText('45 min')
    await expect(text).toBeVisible()
    await expect(text).toHaveClass(/text-white/)
  })

  test('renders orange text when time > 60', async ({ mount }) => {
    const component = await mount(<Time time={90} />)
    const text = component.getByText('90 min')
    await expect(text).toBeVisible()
    await expect(text).toHaveClass(/text-orange/)
  })
})
