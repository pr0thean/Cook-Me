import { viewports } from '../utils'

for (const viewport of viewports) {
  describe(`Recipes Page on ${viewport.title}`, () => {
    beforeEach(() => {
      cy.visit('/recipes')
      cy.viewport(viewport.device)
      window.localStorage.setItem('tour-completed', 'true')
    })

    it('should display page title', () => {
      cy.findByRole('heading', { name: /Recipes/i }).should('be.visible')
    })

    it('render filters', () => {
      cy.findByPlaceholderText(/Search recipes.../i).should('be.visible')

      cy.findByLabelText(/Category/i).should('be.visible')
      cy.findByLabelText(/Tag/i).should('be.visible')
      cy.findByLabelText(/Level/i).should('be.visible')
    })
  })
}
