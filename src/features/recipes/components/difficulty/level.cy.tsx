import { Difficulty as DifficultyType } from '@prisma/client'
import { Difficulty } from './Difficulty'

describe('<Difficulty />', () => {
  it('renders Easy difficulty', () => {
    cy.mount(<Difficulty difficulty={DifficultyType.EASY} />)
    cy.findByText('Easy').should('have.class', 'text-green')
  })

  it('renders Average difficulty', () => {
    cy.mount(<Difficulty difficulty={DifficultyType.MEDIUM} />)
    cy.findByText('Average').should('have.class', 'text-gray')
  })

  it('renders Average difficulty - white', () => {
    cy.mount(<Difficulty difficulty={DifficultyType.MEDIUM} isWhite />)
    cy.findByText('Average').should('have.class', 'text-white')
  })

  it('renders Hard difficulty', () => {
    cy.mount(<Difficulty difficulty={DifficultyType.HARD} />)
    cy.findByText('Hard').should('have.class', 'text-orange')
  })
})
