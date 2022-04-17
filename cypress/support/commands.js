//enables to login to app 
Cypress.Commands.add('logintoApp',(email, password)=>{
    cy.visit('/', {
        onbeforeunload(win){win.localStorage.setItem('token',accessToken)} 
    })
    cy.interceptAs('https://api.segment.io/v1/p', 'POST', 'SignIn')
    cy.contains('Sign in').click()
    cy.wait('@SignIn', {timeout: 15000})
    cy.typeCommand('#1-email', email)//types id to the ID field
    cy.typeCommand('[type="password"]', password)//types password to the password field
    cy.get('#1-email').invoke('prop', 'value')
    .should('contain', email)//enables to check if email is written
    cy.clickButton('.auth0-label-submit')//clicks on login button
    cy.interceptAs('https://acc-xero.katanamrp.com/api/xeroOrganisations/authorize','GET', 'Authorize')//enables to intercept Authorize 
    cy.wait('@Authorize',{timeout: 15000})//waits until logging in
    cy.url().should('include', 'sales')//checks url after login
})
//enables to make intercept
Cypress.Commands.add('interceptAs', (url, method, text) =>{
    cy.intercept({
        method: method,
        url:url
      }).as(text)
})
//enables to check an element if visible
Cypress.Commands.add('isVisible', selector =>{
    cy.get(selector).should('be.visible')
})
//enables to check text if contains
Cypress.Commands.add('isContain', (selector, text) =>{
    cy.get(selector).should('contain', text)
})
//enables to click
Cypress.Commands.add('clickButton', selector =>{
    cy.get(selector).click()
})
//enables to type
Cypress.Commands.add('typeCommand', (selector, text)=>{
    cy.get(selector).type(text)
})
//enables to click "+" > menu titles
Cypress.Commands.add('clickLink', (label) => {
    cy.get('.MuiList-root').contains(label).click()
})