describe('Auth', function () {
  beforeEach(function () {
    cy.visit('/user/login')
  })

  it('Log in with valid credentials', function () {
    cy.intercept('POST', 'user/login')
      .as('login')

    cy.get('#normal_login_email')
      .type(Cypress.env('login'))
    cy.get('#normal_login_password')
      .type(Cypress.env('password'))
    cy.get('.login-form-button')
      .click()

    cy.wait('@login')
      .then((interception) => {
        cy.url()
          .should('include', interception.response.body.payload.userId)
      })

    cy.get('.ant-avatar-square')
      .should('be.visible')
  })

  it('Email input field is required', function () {
    cy.get('#normal_login_email')
      .type('test')
      .clear()

    cy.fixture('errors').then((errors) => {
      cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_email"]]//div[@role="alert"]')
        .should('have.text', errors.required)
    })
  })

  it('Password input field is required', function () {
    cy.get('#normal_login_password')
      .type('test')
      .clear()

    cy.fixture('errors').then((errors) => {
      cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_password"]]//div[@role="alert"]')
        .should('have.text', errors.required)
    })
  })

  it('Email validation', function () {
    cy.get('#normal_login_email')
      .type('vl1vl')

    cy.fixture('errors').then((errors) => {
      cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_email"]]//div[@role="alert"]')
        .should('have.text', errors.email)
    })
  })
})
