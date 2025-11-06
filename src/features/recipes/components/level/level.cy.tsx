import { Difficulty } from '@prisma/client'
import { Level } from './level'

describe('<Level />', () => {
  it('renders Easy level', () => {
    cy.mount(<Level level={Difficulty.EASY} />)
    cy.findByText('Easy').should('have.class', 'text-green')
  })

  it('renders Average level', () => {
    cy.mount(<Level level={Difficulty.MEDIUM} />)
    cy.findByText('Average').should('have.class', 'text-gray')
  })

  it('renders Average level - white', () => {
    cy.mount(<Level level={Difficulty.MEDIUM} isWhite />)
    cy.findByText('Average').should('have.class', 'text-white')
  })

  it('renders Hard level', () => {
    cy.mount(<Level level={Difficulty.HARD} />)
    cy.findByText('Hard').should('have.class', 'text-orange')
  })
})
