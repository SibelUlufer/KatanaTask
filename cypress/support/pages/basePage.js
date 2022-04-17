class BasePage{
    //enables to logout
    static logOut(){
        cy.clickButton('[data-testid="userInfoContainer"]')//clicks on right top menu icon
        cy.clickButton('#logout')//clicks on logout link
        cy.url().should('contain', 'katanamrp.com')//checks the url after logout
    }
    //enables to click "today", "my week","messages", "profile" menus, and checks the url
    static clickPlusMenu(label,text){
        cy.clickButton('#globalAdd')
        cy.get('.MuiMenu-paper').contains(label).click()
        cy.url().should('contain', text)//checks the url
    }
    //enables to click top menu, and checks the url
    static clickTopMenu(label, text){
        cy.get('.MuiTab-wrapper').contains(label).click()
        cy.url().should('contain', text)//checks the url
    }
    //manages saving action
    static isSaved(){
        cy.get('.MuiGrid-grid-xs-true').then( ele =>{
            if(ele.text().includes('Customer')){
                cy.get('.jss84').then( ele =>{
                    if(ele.text().includes('Not saved')){
                        cy.isVisible('.notSaved')
                        cy.isContain('.notSaved', 'Not saved')
                        cy.log('Not saved!')
                    }else{
                        cy.isVisible('.saved')
                        cy.isContain('.saved', 'All changes saved')
                        cy.log('All changes saved!')
                    }
                })
            }else{//for Sales Order
                cy.get('.jss122').then( ele =>{
                    if(ele.text().includes('Not saved')){
                        cy.isVisible('.notSaved')
                        cy.isContain('.notSaved', 'Not saved')
                        cy.log('Not saved!')
                    }else{
                        cy.isVisible('.saved')
                        cy.isContain('.saved', 'All changes saved')
                        cy.log('All changes saved!')
                    }
                })
            }
        })
    }
}
export default BasePage