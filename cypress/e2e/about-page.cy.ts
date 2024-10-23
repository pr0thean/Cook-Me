import { viewports } from '../utils'

// https://github.com/mswjs/msw/issues/1644
// Mocking doesn't work on static pages.
for (const viewport of viewports) {
  describe(`About Page on ${viewport.title}`, () => {
    beforeEach(() => {
      cy.visit('/about')
      cy.viewport(viewport.device)
      window.localStorage.setItem('tour-completed', 'true')
    })

    it('should display page title', () => {
      cy.findByRole('heading', { name: /About Cook Me/i }).should('be.visible')
    })
  })
}
