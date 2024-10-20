import { viewports } from '../utils'

for (const viewport of viewports) {
  describe(`About Page on ${viewport.title}`, () => {
    beforeEach(() => {
      cy.visit('/about')
      cy.viewport(viewport.device)
      window.localStorage.setItem('tour-completed', 'true')
    })

    it('should display page title', () => {
      cy.findByRole('heading', { name: /About/i }).should('be.visible')
    })
  })
}
