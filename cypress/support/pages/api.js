class api{
    //sets random email and keeps it to use it later on for API
    static setEmail(){
        let randomText = ''
        let testText =''
        let pattern = 'abcdefghigklmnopqrstyvwxyz'
        for(let i=0; i<10; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testText = randomText + '@gmail.com'
        Cypress.env('emailS', testText)
    }
    //sets random first name and keeps it to use it later on for API
    static setFirstName(){
        let randomText = ''
        let testName =''
        let pattern = 'abcdefghiklmnopqrstuyvwxyz'
        for(let i=0; i<6; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testName = randomText
        Cypress.env('firstName', testName)
    }
    //sets random last name and keeps it to use it later on for API
    static setLastName(){
        let randomText = ''
        let testLastName =''
        let pattern = 'abcdefghiklmnopqrstuyvwxyz'
        for(let i=0; i<6; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length)) 
        testLastName = randomText
        Cypress.env('LastName', testLastName)
    }
    //sets random phone and keeps it to use it later on for API
    static setPhoneNumber(){
        let randomNumber = ''
        let testText = ''
        var NumberPattern ='0123456789'
        for(var i=0; i<10; i++)
        randomNumber+=NumberPattern.charAt(Math.floor(Math.random() * NumberPattern.length))
        testText = randomNumber
        Cypress.env('PhoneNumber', testText)
    }
    //enables to list all customers
    static listCustomers(){
        cy.request({
            url:'https://api.katanamrp.com/v1/customers',
            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
            method: 'GET'  
            }).then(response=>{
                    expect(response.status).to.eq(200)
            })
    }
    //creates a customer and checks if created
    static addCustomerAndCheck(){
        this.setEmail()
        this.setFirstName()
        this.setLastName()
        this.setPhoneNumber()
        cy.request({
            url:'https://api.katanamrp.com/v1/customers',
            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
            body:{
                    "name": "sibel test",
                    "first_name": Cypress.env('firstName'),
                    "last_name": Cypress.env('LastName'),
                    "company": "KATANA TEST",
                    "email": Cypress.env('emailS'),
                    "currency": "USD",
                    "phone": Cypress.env('PhoneNumber'),
                    "addresses": [{
                        "entity_type": "billing",
                        "line_1": "Germantown Ave, Philadelphia, Pennsylvania, ABD"     
                    }]
            },
            method: 'POST'  
            }).then(response=>{
                    expect(response.status).to.eq(200)
                    const customerName = response.body.name
                    const customerID = response.body.id
                    cy.wrap(response.body.id).as('cusID')
                    Cypress.env('cusID', customerID)
                    const firstName = response.body.first_name
                    const lastName = response.body.last_name
                    const mail = response.body.email
                    const phone = response.body.phone
                    cy.request({
                        headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
                        url: 'https://api.katanamrp.com/v1/customers' + '?' + customerName,
                        method: 'GET'
                    }).then(response =>{
                        expect(response.status).to.eq(200) 
                        expect(response.body.data[0]).has.property('name', customerName)
                        expect(response.body.data[0]).has.property('id', customerID)
                        expect(response.body.data[0]).has.property('first_name', firstName)
                        expect(response.body.data[0]).has.property('last_name', lastName)
                        expect(response.body.data[0]).has.property('email', mail)
                        expect(response.body.data[0]).has.property('phone', phone)
                    })
            })
    }
    //checks display name validation
    static validationCheck(){
        this.setEmail()
        this.setFirstName()
        this.setLastName()
        this.setPhoneNumber()
        cy.request({
            url:'https://api.katanamrp.com/v1/customers',
            headers:{'Authorization':'Bearer '+Cypress.env('api_key')},
            body:{
                    "name": "",
                    "first_name": Cypress.env('firstName'),
                    "last_name": Cypress.env('LastName'),
                    "company": "KATANA TEST",
                    "email": Cypress.env('emailS'),
                    "currency": "USD",
                    "phone": Cypress.env('PhoneNumber')
            },
            failOnStatusCode: false ,
            method: 'POST'  
        }).then(response =>{
            expect(response.status).to.eq(422) 
            expect(response.body.error).has.property('code', 'VALIDATION_FAILED')
            expect(response.body.error).has.property("message", "The request body is invalid. See error object `details` property for more info.")
        })
    }
    //checks location in sales order
    static checkLocationInSalesOrder(){
        cy.request({
            url:'https://api.katanamrp.com/v1/sales_orders',
            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
            body:{
                "customer_id": 25760083,
                "order_no": "SU-111",
                "location_id": 49178,
                "picked_date": "17.04.2022",
                "status": "NOT_SHIPPED",
                "currency": "USD",
                "additional_info": "",
                "sales_order_rows":[{
                        "quantity": 4,
                        "variant_id": 12106964,
                        "tax_rate_id": 124826,
                        "price_per_unit": 1250
                }]
            },
            failOnStatusCode: false ,
            method: 'POST'  
        }).then(response =>{
            expect(response.status).to.eq(422) 
            expect(response.body.error).has.property('name', 'UnprocessableEntityError')
            expect(response.body.error).has.property("message", "incorrect location id")
        })
    }
    //creates customer and sales order and checks if created
    static createSalesOrderAndCheck(){
        this.setEmail()
        this.setFirstName()
        this.setLastName()
        this.setPhoneNumber()
        cy.request({
            url:'https://api.katanamrp.com/v1/customers',
            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
            body:{
                    "name": "sibel test",
                    "first_name": Cypress.env('firstName'),
                    "last_name": Cypress.env('LastName'),
                    "company": "KATANA TEST",
                    "email": Cypress.env('emailS'),
                    "currency": "USD"     
            },
            method: 'POST'  
            }).then(response=>{
                    expect(response.status).to.eq(200)//customer created successfully
                    const cusID = response.body.id//customer id
                    cy.request({
                        headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
                        url: 'https://api.katanamrp.com/v1/sales_orders',
                        body:{
                            "customer_id": cusID,
                            "order_no": "SU-113",
                            "location_id": 49197,
                            "picked_date": "17.04.2022",
                            "status": "NOT_SHIPPED",
                            "currency": "USD",
                            "additional_info": "",
                            "sales_order_rows":[{
                                    "quantity": 4,
                                    "variant_id": 12106964,
                                    "tax_rate_id": 124826,
                                    "price_per_unit": 125
                            }]
                        },
                        method: 'POST'
                    }).then(response =>{
                        const customerID = response.body.customer_id
                        expect(response.status).to.eq(200)//order created successfully
                        expect(response.body).to.have.property('customer_id', customerID)//checks customer id in order
                    })
            })
    }
    //creates customer and sales order, then makes update on order and checks if updated
    static updateSalesOrder(){
        this.setEmail()
        this.setFirstName()
        this.setLastName()
        this.setPhoneNumber()
        cy.request({
            url:'https://api.katanamrp.com/v1/customers',
            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
            body:{
                    "name": "sibel test",
                    "first_name": Cypress.env('firstName'),
                    "last_name": Cypress.env('LastName'),
                    "company": "KATANA TEST",
                    "email": Cypress.env('emailS'),
                    "currency": "USD"     
            },
            method: 'POST'  
            }).then(response=>{
                    expect(response.status).to.eq(200)//customer created successfully
                    const cusID = response.body.id//customer id
                    cy.request({
                        headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
                        url: 'https://api.katanamrp.com/v1/sales_orders',
                        body:{
                            "customer_id": cusID,
                            "order_no": "SU-113",
                            "location_id": 49197,
                            "picked_date": "17.04.2022",
                            "status": "NOT_SHIPPED",
                            "currency": "USD",
                            "additional_info": "",
                            "sales_order_rows":[{
                                    "quantity": 4,
                                    "variant_id": 12106964,
                                    "tax_rate_id": 124826,
                                    "price_per_unit": 125
                            }]
                        },
                        method: 'POST'
                    }).then(response =>{
                        const customerID = response.body.customer_id
                        expect(response.status).to.eq(200)//created order successfully
                        expect(response.body).to.have.property('customer_id', customerID)//checks customer id in order
                        const orderID = response.body.id//order id
                        cy.request({
                            headers:{'Authorization':'Bearer '+ Cypress.env('api_key')},
                            url: 'https://api.katanamrp.com/v1/sales_orders' +"/"+orderID,
                            body:{
                                "customer_id": cusID,
                                "order_no": "SU-113",
                                "location_id": 49197,
                                "picked_date": "17.04.2022",
                                "status": "NOT_SHIPPED",
                                "currency": "USD",
                                "additional_info": "test for update",//added this information
                            },
                            method: 'PATCH'
                        }).then(response=>{
                            expect(response.status).to.eq(200)//updated successfully
                            const info = response.body.additional_info
                            const source = response.body.source
                            expect(response.body).to.have.property('additional_info', info)//checks if updated
                            expect(response.body).to.have.property('source', source)//shows that the source is API
                        })
                    })
            })
    }
}
export default api