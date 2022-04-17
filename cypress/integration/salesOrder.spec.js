/// <reference types="cypress" />

import BasePage from "../support/pages/basePage"
import salesOrder from "../support/pages/salesOrder"

describe('Sales order page testing', ()=>{
    beforeEach(() => {
        cy.logintoApp(Cypress.env('email'), Cypress.env('password'))
        BasePage.clickPlusMenu('Sales order', 'salesorder')
        salesOrder.checkOrderName()
        salesOrder.createCustomerOnSalesOrder()
    })
    it('Should create order and check it', ()=>{
        salesOrder.checkOrderName()
    })
    it('Should edit customer\'s address and check it', ()=>{
        salesOrder.editAddressAndCheck()
    })
    it('Should find the created sales order on Sales Orders list', ()=>{
        BasePage.clickTopMenu('Sell', 'sales')
        salesOrder.clearFilterOnSalesOrders()
        salesOrder.typeNameforFiltering()
        salesOrder.isOrderFound()
    })
    it('Should create sales order by adding items',()=>{
        salesOrder.addExistItem('DT-BR')
    })
    it('Should check numbers in sales orders after adding item', ()=>{
        salesOrder.addExistItem('DT-BR')
        salesOrder.changeQuantity('4')
        salesOrder.orderCalculation()
    })
    it('Should have same total amount both in sales order list and order detail', ()=>{
        salesOrder.addExistItem('DT-BR')
        salesOrder.orderCalculation()
        BasePage.clickTopMenu('Sell', 'sales')
        salesOrder.clearFilterOnSalesOrders()
        salesOrder.typeNameforFiltering()
        salesOrder.isOrderFound()
        salesOrder.checkAmountInOrderList()
    })
})