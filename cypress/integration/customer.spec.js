/// <reference types="cypress" />

import BasePage from "../support/pages/basePage"
import customer from "../support/pages/customer"

describe('Customer page testing', ()=>{
    beforeEach(() => {
        cy.logintoApp(Cypress.env('email'), Cypress.env('password'))
        })
    it('Should create customer and find it in Contacts, and logout', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')
        customer.addCustomer()
        BasePage.clickTopMenu('Contacts', 'contacts')
        customer.findCustomer()
        BasePage.logOut()
    })
    it('Should add shipping address and check it', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')
        customer.addCustomer()
        customer.addShippingAddress()
    })
    it('Should add another shipping address and check it', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')
        customer.addCustomer()
        customer.addShippingAddress()
        customer.useBillingAddress()
    })
    it('Should remove the address', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')
        customer.addCustomer()
        customer.removeAddress()
    })
    it('Should create customer and find it on Sales Order', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')//clicks on "Sales order" from the menu
        customer.addCustomer()
        BasePage.clickPlusMenu('Sales order', 'salesorder')
        customer.searchForCustomer()
    })
    it('Should create customer from Contacts and find it in Contacts', ()=>{
        BasePage.clickTopMenu('Contacts', 'contacts')
        customer.addCustomerOnContacts()
        BasePage.clickTopMenu('Contacts', 'contacts')
        customer.findCustomer()
    })
    it('Should not create customer without display name and valid email', ()=>{
        BasePage.clickPlusMenu('Customer', 'customer')
        customer.checkRequiredFieldsBehaviour()
    })
})