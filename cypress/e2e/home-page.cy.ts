import { fixtures } from 'mocks/utils/fixtures'
import { viewports } from '../utils'

// https://github.com/mswjs/msw/issues/1644
// Mocking doesn't work on static pages.
for (const viewport of viewports) {
  describe(`Home Page on ${viewport.title}`, () => {
    beforeEach(() => {
      cy.visit('/')
      cy.viewport(viewport.device)
      window.localStorage.setItem('tour-completed', 'true')
    })

    it('should display header links', () => {
      const homeLink = cy
        .findByRole('link', { name: /Home/i })
        .should('be.visible')
        .and('have.attr', 'href', '/')

      homeLink.parent().within(() => {
        cy.findByRole('link', { name: /Recipes/i })
          .should('be.visible')
          .and('have.attr', 'href', '/recipes')

        cy.findByRole('link', { name: /About/i })
          .should('be.visible')
          .and('have.attr', 'href', '/about')
      })
    })

    it('should display page title', () => {
      cy.findByRole('heading', { name: /Cook Me/i }).should('be.visible')
    })

    it('can open and hide search form', () => {
      cy.findByPlaceholderText(/Search recipes.../i).should('not.exist')

      cy.findByLabelText('search-icon', { selector: 'svg' }).click()
      cy.findByPlaceholderText(/Search recipes.../i).should('be.visible')

      cy.findByRole('heading', { name: /Cook Me/i }).click()
      cy.findByPlaceholderText(/Search recipes.../i).should('not.exist')
    })

    it('can click "Browse recipes" button and navigate to Recipes Page', () => {
      cy.findByRole('button', { name: fixtures.recipesButton.label }).click()
      cy.url().should('include', fixtures.recipesButton.link)
    })
  })
}
