import { Level } from './level'

describe('<Level />', () => {
  it('renders Easy level', () => {
    cy.mount(<Level level="Easy" />)
    cy.findByText('Easy').should('have.class', 'text-green')
  })

  it('renders Average level', () => {
    cy.mount(<Level level="Average" />)
    cy.findByText('Average').should('have.class', 'text-gray')
  })

  it('renders Average level - white', () => {
    cy.mount(<Level level="Average" isWhite />)
    cy.findByText('Average').should('have.class', 'text-white')
  })

  it('renders Hard level', () => {
    cy.mount(<Level level="Hard" />)
    cy.findByText('Hard').should('have.class', 'text-orange')
  })
})
