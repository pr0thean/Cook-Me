import { Time } from './Time'

describe('<Time />', () => {
  it('renders green text when time <= 30', () => {
    cy.mount(<Time time={30} />)
    cy.findByText('30 min').should('have.class', 'text-green')
  })

  it('renders gray text when time > 30 && time <= 60', () => {
    cy.mount(<Time time={45} />)
    cy.findByText('45 min').should('have.class', 'text-gray')
  })

  it('renders white text when time > 30 && time <= 60 and isWhite prop is provided', () => {
    cy.mount(<Time time={45} isWhite />)
    cy.findByText('45 min').should('have.class', 'text-white')
  })

  it('renders orange text when time > 60', () => {
    cy.mount(<Time time={90} />)
    cy.findByText('90 min').should('have.class', 'text-orange')
  })
})
