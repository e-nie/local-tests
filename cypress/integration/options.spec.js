describe('Options', function () {
  before(function () {
    cy.visit('/')

    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_server')}/user/login`,
      body: {
        email: Cypress.env('login'),
        password: Cypress.env('password')
      }
    }).then((response) => {
      window.localStorage.setItem('userId', response.body.payload.userId)
      window.localStorage.setItem('token', response.body.payload.token)

      cy.request({
        method: 'PATCH',
        url: `${Cypress.env('api_server')}/user/profile`,
        headers: {
          Authorization: response.body.payload.token
        },
        body: {
          firstName: "Eva",
          lastName: "Niehaus",
          phone: "491512714742",
          about: "Lernen, lernen und nochmals lernen.",
          goals: "Become a confident QA Software Tester for a start. Find a relevant job in Germany where I currently reside. The more will follow.",
          countryName: "Germany",
          englishLevel: "Advanced",
          tShirtSize: "Women - S"
        }
      })

      cy.visit(`/settings/${response.body.payload.userId}/profile`)

    })
  })

  it('Profile form fill', function () {
    cy.get('[data-qa="englishLevel"]').click()
    cy.get('[class*="ant-select-item"][title="Advanced"]')
    cy.intercept('PATCH', 'user/profile').as('profileChange')
    cy.get('.ant-btn-primary').click()

    cy.wait('@profileChange')
      .then((interception) => {
        expect(interception.response.body.message).to.eq('User profile updated')
      })
  })
})
