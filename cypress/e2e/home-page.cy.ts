import { viewports } from '../utils'

for (const viewport of viewports) {
  describe(`Home Page on ${viewport.title}`, () => {
    beforeEach(() => {
      cy.visit('/')
      cy.viewport(viewport.device)
    })

    it('should display Home link', () => {
      const homeLink = cy.findByRole('link', { name: /Home/i }).should('be.visible')
      homeLink.should('have.attr', 'href', '/')
    })

    it('should display title', () => {
      cy.findByRole('heading', { name: /Recipes website/i }).should('be.visible')
    })

    it('can open and hide search form', () => {
      cy.findByPlaceholderText(/Search recipes.../i).should('not.exist')

      cy.findByLabelText('search-icon', { selector: 'svg' }).click()
      cy.findByPlaceholderText(/Search recipes.../i).should('be.visible')

      cy.findByRole('heading', { name: /Recipes website/i }).click()
      cy.findByPlaceholderText(/Search recipes.../i).should('not.exist')
    })

    it('can click "Browse recipes" button and navigate to Recipes Page', () => {
      cy.findByRole('button', { name: /Browse recipes/i }).click() // replace to mock later
      cy.url().should('include', '/recipes')
    })
  })
}
