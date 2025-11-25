// import { expect, test } from '@playwright/experimental-ct-react'
// import { Difficulty as DifficultyType } from '@prisma/client'
// import { Difficulty } from './Difficulty'

// Error with DifficultyType import from @prisma/client

// test.describe('<Difficulty />', () => {
//   test('renders Easy difficulty', async ({ mount }) => {
//     const component = await mount(<Difficulty difficulty={DifficultyType.EASY} />)
//     const text = component.getByText('Easy')
//     await expect(text).toBeVisible()
//     await expect(text).toHaveClass(/text-green/)
//   })

//   test('renders Average difficulty', async ({ mount }) => {
//     const component = await mount(<Difficulty difficulty={DifficultyType.MEDIUM} />)
//     const text = component.getByText('Average')
//     await expect(text).toBeVisible()
//     await expect(text).toHaveClass(/text-gray/)
//   })

//   test('renders Average difficulty - white', async ({ mount }) => {
//     const component = await mount(<Difficulty difficulty={DifficultyType.MEDIUM} isWhite />)
//     const text = component.getByText('Average')
//     await expect(text).toBeVisible()
//     await expect(text).toHaveClass(/text-white/)
//   })

//   test('renders Hard difficulty', async ({ mount }) => {
//     const component = await mount(<Difficulty difficulty={DifficultyType.HARD} />)
//     const text = component.getByText('Hard')
//     await expect(text).toBeVisible()
//     await expect(text).toHaveClass(/text-orange/)
//   })
// })
