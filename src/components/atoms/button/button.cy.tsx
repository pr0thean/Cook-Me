import React from 'react'

import { Button } from './Button'

describe('<Button />', () => {
  it('renders primary variant', () => {
    cy.mount(<Button label="Browse recipes" />)

    cy.findByRole('button', { name: 'Browse recipes' })
      .should('have.class', 'bg-orange')
      .and('have.class', 'text-off-black')
      .and('not.have.class', 'underline')
  })

  it('renders link variant', () => {
    cy.mount(<Button label="Browse recipes" variant="link" />)

    cy.findByRole('button', { name: 'Browse recipes' })
      .should('have.class', 'bg-transparent')
      .and('have.class', 'text-yellow')
      .and('have.class', 'underline')
  })

  it('renders as a link when link prop is provided', () => {
    cy.mount(<Button label="Browse recipes" link="/recipes" />)

    cy.findByRole('link', { name: 'Browse recipes' })
      .should('have.attr', 'href', '/recipes')
      .within(() => {
        cy.findByRole('button', { name: 'Browse recipes' }).should('exist')
      })
  })
})
