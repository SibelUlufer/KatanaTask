import BasePage from "./basePage"

class customer{
    //enabbles to add customer
    static addCustomer(){
        this.createName('[data-testid="inputCustomerFirstName"]')
        this.createLastName('[data-testid="inputCustomerLastName"]')
        this.createCompany('[data-testid="inputCustomerCompany"]')
        this.isCustomerNameTogether()
        this.createEmail('[data-testid="inputCustomerEmail"]')
        this.createPhoneNumber('[data-testid="inputCustomerPhone"]',{force:true})
        this.enterAddress()
    }
    //enables to add shipping address and checks if added
    static addShippingAddress(){
        cy.clickButton('[name="defaultShippingAddress"]')
        this.createAddress('[name="line1"]', 'Denmark')
        cy.get('[role="combobox"][aria-expanded="true"]').type('{downArrow}{enter}')//selects first option from combobox
        cy.get('[name="line1"]').then( line1 =>{
            const adLine = line1.val()
            Cypress.env('addressInfo', adLine)
            cy.clickButton('#submitButton')
            BasePage.isSaved()
            cy.isContain('[data-testid="inputCustomerDefaultShippingAddress"] > .MuiInputBase-root',Cypress.env('addressInfo'))
        })
    }
    //enables to click on Use billing info button and checks the actions
    static useBillingAddress(){
        cy.get('.jss76 > .MuiGrid-justify-content-xs-flex-end').then( link=>{
            if(link.find('.MuiButton-textPrimary').is(':visible')){
                cy.get('.MuiGrid-justify-content-xs-flex-end > div > .MuiButtonBase-root').click()
                cy.isVisible('[data-testid="inputCustomerShippingAddress-0"]')
                cy.isContain('[data-testid="inputCustomerShippingAddress-0"]',Cypress.env('addressInfo'))
                cy.wait(1000)
            }
        })
    }
    //enables to remove address and checks if removed
    static removeAddress(){
        cy.get('[data-testid="textAddressInformation"]').click()
        cy.clickButton('#removeAddress')
        cy.get('[placeholder="Enter address..."]').then( ele=>{
            if(ele.is(':placeholder-shown')){
                cy.get('[placeholder="Enter address..."]').should('have.value', '')
            }
        })
    }
    //enables to add customer in Contacts page
    static addCustomerOnContacts(){
        this.clearFilterOnContact()
        cy.isContain('.MuiButton-textPrimary', 'New customer').click()//clicks on "+ New Customer" button in Contacts
        this.addCustomer()
    }
    //manages the validations for mail and display name in customer page
    static checkRequiredFieldsBehaviour(){
        cy.typeCommand('[data-testid="inputCustomerEmail"]', 'sibeluluferhotmail.com')
        BasePage.isSaved()
        this.createName('[data-testid="inputCustomerFirstName"]')
        this.createLastName('[data-testid="inputCustomerLastName"]')
        cy.get('[data-testid="inputCustomerEmail"]').clear()
        this.createEmail('[data-testid="inputCustomerEmail"]')
        cy.get('.jss76').click()
        BasePage.isSaved()    
    }
    //enables to clear filter in Contact page
    static clearFilterOnContact(){
        cy.get('.MuiButton-textPrimary').each( btn =>{
            const clrBtn = btn.text()
            if(clrBtn.includes('Clear filters')){
                cy.wrap(btn).click()
                cy.get('.end-xs').should('not.contain', 'Clear filters')
                return false
            }
        })
    }
    //enables to search for a customer and checks if found
    static findCustomer(){
        this.clearFilterOnContact()
        cy.get('[aria-colindex="4"] > .ag-floating-filter-full-body').clear().type(Cypress.env('emailS'),{delay:200})
        cy.isVisible('[ref="eCenterContainer"]')
        cy.isContain('[ref="eCenterContainer"]',Cypress.env('emailS'))
    }
    //enables to check customer full name in customer page
    static isCustomerNameTogether(){
        cy.get('[data-testid="header-name-customer"]').then( name=>{
            let nameTogether = Cypress.env('randomName') +" "+ Cypress.env('randomLastName')
            Cypress.env('customerFullName', nameTogether)
            cy.isContain(name, nameTogether)
        })
    }
    //enables to search for a customer in sales order page
    static searchForCustomer(){
        cy.get('[placeholder="Search or create customer"]').type(Cypress.env('randomName'), {delay:300})
        cy.wait(1000)//waits to load the results
        cy.get('[placeholder="Search or create customer"]').type('{downArrow}{enter}')//selects first option from combobox
    }
    //enables to enter address and checks if entered
    static enterAddress(){
        cy.get('[data-testid="inputCustomerDefaultBillingAddress"]').click()
        this.createAddress('[role="dialog"] [placeholder="Enter street name"]', 'Tallinn')
        cy.get('[role="combobox"][aria-expanded="true"]').type('{downArrow}{enter}')//selects first option from combobox
        cy.get('[role="dialog"] [placeholder="Enter street name"]').then( line1 =>{
            const adLine = line1.val()
            Cypress.env('addressInfo', adLine)
            cy.clickButton('#submitButton')
            BasePage.isSaved()
            cy.isContain('[data-testid="textAddressInformation"]',Cypress.env('addressInfo'))
            cy.get('#app').click()
        })
    }
    //manages to create address
    static createAddress(selector,text){
        cy.get(selector).type(text, { delay: 200 })  
        Cypress.env('randomAdress', text)
        cy.wrap(text).as('Address')
    }
    //creates random name and keeps its value to use later on
    static createName(selector){
        let randomText = ''
        let testName =''
        let pattern = 'abcdefghiklmnopqrstuyvwxyz'
        for(let i=0; i<6; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testName = randomText
        Cypress.env('randomName', testName)
        cy.wrap(testName).as('Name')
        cy.typeCommand(selector,String(testName))  
    }
    //creates random lastname and keeps its value to use later on
    static createLastName(selector){
        let randomText = ''
        let testLastName =''
        let pattern = 'abcdefghiklmnopqrstuyvwxyz'
        for(let i=0; i<6; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testLastName = randomText
        Cypress.env('randomLastName', testLastName)
        cy.wrap(testLastName).as('LastName')
        cy.typeCommand(selector,String(testLastName))  
    }
    //creates random Company name and keeps its value to use later on
    static createCompany(selector){
        let randomText = ''
        let testCompany =''
        let pattern = 'abcdefghiklmnopqrstuyvwxyz'
        for(let i=0; i<6; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testCompany = randomText
        Cypress.env('randomCompany', testCompany)
        cy.wrap(testCompany).as('Company')
        cy.typeCommand(selector, String(testCompany))  
    }
    //creates random mail and keeps its value to use later on
    static createEmail(selector){
        let randomText = ''
        let testText =''
        let pattern = 'abcdefghigklmnopqrstyvwxyz'
        for(let i=0; i<10; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testText = randomText + '@gmail.com'
        Cypress.env('emailS', testText)
        cy.wrap(testText).as('email')
        cy.typeCommand(selector, String(testText)) 
    }
    //creates random phone and keeps its value to use later on
    static createPhoneNumber(selector){
        let randomNumber = ''
        let testText = ''
        var NumberPattern ='0123456789'
        for(var i=0; i<10; i++)
        randomNumber+=NumberPattern.charAt(Math.floor(Math.random() * NumberPattern.length))
        testText = randomNumber
        Cypress.env('RandomPhone', testText)
        cy.wrap(testText).as('PhoneNumber')
        cy.typeCommand(selector, String(testText))
    }
}
export default customer