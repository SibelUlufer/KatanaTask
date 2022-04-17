/// <reference types ="cypress" />

import api from "../support/pages/api"

describe('API testing', ()=>{

    it('Should list customers', ()=>{
        api.listCustomers()
    })
    it('Should create a customer and check if created', ()=>{
        api.addCustomerAndCheck()
    })
    it('Should not  create a customer without display name', ()=>{
        api.validationCheck()
    })
    it('Should create customer and makes sales order and check it', ()=>{
        api.createSalesOrderAndCheck()
    })
    it('Should not create sales order without location', ()=>{
        api.checkLocationInSalesOrder()
    })
    it('Should update sales order', ()=>{
        api.updateSalesOrder()
    })
})