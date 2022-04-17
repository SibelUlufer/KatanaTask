import BasePage from "./basePage"
import customer from "./customer"

class salesOrder{
    //manages order name behaviours (before&after customer full name) and checks
    static checkOrderName(){
        cy.get('[placeholder="Search or create customer"]').then( cus =>{
            if(cus.is(':placeholder-shown')){//before customer full name typed
                cy.isVisible('[data-testid="header-name-salesOrder"]').and('not.be.empty')//checks visibility of sales order no
            }else{//after customer full name typed
                cy.get('[name="orderNo"]').then( orderNo =>{
                    const orNo = orderNo.val()
                    cy.wrap(orNo).as('orderNo')
                    Cypress.env('orderNo', orNo)
                    const orName= orNo + " " + Cypress.env('newDisplayName')
                    cy.isContain('[data-testid="header-name-salesOrder"]', orName)
                })       
            }
        })
    }
    //creates customer in sales order page and checks if created
    static createCustomerOnSalesOrder(){
        customer.createName('[placeholder="Search or create customer"]')//types random name in "customer search" in sales order
        cy.typeCommand('[placeholder="Search or create customer"]','{downArrow}{enter}')//selects first option from combobox
        cy.clickButton('.grid-navlink')
        customer.createName('[data-testid="inputCustomerFirstName"]')
        customer.createLastName('[data-testid="inputCustomerLastName"]',{force:true})
        this.makeDisplayNameSameWithNames()
        cy.clickButton('[placeholder="Enter address..."]')
        customer.createAddress('[role="combobox"] > .MuiInputBase-root > .MuiInputBase-input','Germany')
        cy.get('[role="combobox"][aria-expanded="true"]').type('{downArrow}{enter}')//selects first option from combobox
        cy.clickButton('#submitButton')//saves address
        cy.clickButton('.MuiGrid-justify-content-xs-center')
        cy.go('back')//goes to previous page
        cy.typeCommand('[placeholder="Search or create customer"]',Cypress.env('randomName'))
        cy.wait(2000)//waits to load the results
        cy.get('[placeholder="Search or create customer"]').type('{downArrow}{enter}')//selects first option from combobox
    }
    //enables to edit address and checks if edited
    static editAddressAndCheck(){
        cy.get('[data-testid="address-field-location"]').click()
        customer.createAddress('[placeholder="Enter street name"]', 'Istanbul')
        cy.get('[placeholder="Enter street name"]').type('{downArrow}{enter}')//selects first option from combobox
        cy.get('[placeholder="Enter street name"]').then( line1 =>{
            const adLine = line1.val()
            Cypress.env('addressInfo', adLine)
            cy.clickButton('#submitButton')
            BasePage.isSaved()
            cy.isContain('[data-testid="address-field-location"]',Cypress.env('addressInfo'))
        })
    }
    //makes the display name same with name&last name and checks if correct
    static makeDisplayNameSameWithNames(){
        cy.get('[data-testid="inputCustomerDisplayName"]').then( display=>{
            let newDisplay = Cypress.env('randomName') +" "+ Cypress.env('randomLastName')
            Cypress.env('newDisplayName', newDisplay)
            cy.wrap(display).find('.MuiInputBase-root > .MuiInputBase-input').clear()
            cy.wrap(display).find('.MuiInputBase-root > .MuiInputBase-input').type(newDisplay, {delay:100})
        })
    }
    //clears filter in sales order page
    static clearFilterOnSalesOrders(){
        cy.get('.col-xs-8').then( btn =>{
            if(btn.find('.end-xs .MuiButton-textPrimary').is(':visible')){
                cy.get('.end-xs .MuiButton-textPrimary').click()
                cy.log('Clear filters')
                cy.get('.end-xs').should('not.contain', 'Clear filters')
                return false
            }
        })
    }
    //checks if whether the order is found or not
    static isOrderFound(){
        cy.get('.jss192').then(items=>{
            if(items.val().includes('0')){
                cy.log('There is no order belongs this customer!')
            }else{
                cy.isVisible('[ref="eCenterContainer"][role="rowgroup"]')
            }
        })
    }
    //types the name for filtering in sales orders page
    static typeNameforFiltering(){
        cy.get('[aria-colindex="4"] .ag-floating-filter-input').type(Cypress.env('randomName'), {delay:200})
    }
    //enables to add an exist item in a order
    static addExistItem(text){
        cy.get('[data-testid="variant-cell-renderer"]').type(text)
        cy.wait(1000)//waits to load the results
        cy.get('.ag-cell[col-id="item"]').type('{downArrow}{enter}',{delay:200})//selects first option from combobox
        BasePage.isSaved() 
    }
    //enables to change quantity number of item
    static changeQuantity(number){
        cy.get('[data-testid="number-renderer-value-quantity"]').type(number)
        cy.get('.ag-react-container .MuiInputBase-input')
        .type('{enter}',{force:true})
        cy.clickButton('#app > :nth-child(1)')
        cy.wait(2000)//waits to load the results
    }
    //checks order calculation in order page
    static orderCalculation(){
        cy.get('[row-index="0"]').then(row=>{
            let quantity = row.find('[data-testid="number-renderer-value-quantity"]').text()
            let perPrice = row.find('[data-testid="number-renderer-value-item.salesPrice"]').text()
            let totalPrice = row.find('[data-testid="number-renderer-value-totalCost"]').text()
            let tax = row.find('[col-id="tax"].ag-cell').text()
            let taxRate = tax.replace(/\D/g, '')
            cy.isContain('[data-testid="order-total-totalUnits"] .numberSuffix', String(quantity))
            totalPrice = Number(quantity) * Number(perPrice)
            cy.isContain('[data-testid="order-total-subtotal"] .numberSuffix', String(totalPrice))
            let plusTax = Number(taxRate) * Number(totalPrice) / 100
            cy.isContain('[data-testid="order-total-plusTaxRate"] .numberSuffix', String(plusTax))
            let total = Number(totalPrice) + Number(plusTax)
            Cypress.env('totalAmountInOrderDetail', total)
            cy.isContain('[data-testid="order-total-total"] .numberSuffix', String(total))
        })
    }
    //checks the amount for an order in sales order list
    static checkAmountInOrderList(){
        cy.wait(2000)//waits to load the results
        cy.get('.ag-floating-top-container > .ag-row > [aria-colindex="5"]').then( row=>{
            cy.wrap(row).should('contain', Cypress.env('totalAmountInOrderDetail'))
        })
    }

}
export default salesOrder