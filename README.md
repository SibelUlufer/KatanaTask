## Getting started
- Install dependencies with npm
```
$ npm i
```
- Run the project
```
"npm run cy:open" or "npx cypress open"
```

## CYPRESS DASHBOARD 
- Dashboard integration with
```
"npm run cy:run"
```
## GitHub 
- Integration Cypress runs into GitHub actions with
```
"npm run cy:run-dashboard"
```

**../integrations file has 3 spec files.**
**../integrations/apiTest.spec.js includes api tests which consist of 6 cases**
**../integrations/customer.spec.js includes customer related tests which consist of 7 cases.**
**../integrations/salesOrder.spec.js includes sales order related tests which consist of 5 cases.**

**../support/pages has 3 .js files**
**../support/pages/api.js includes fuctions for api testing.**
**../support/pages/basePage.js includes general base page functions.**
**../support/pages/customer.js includes functions for customer testing.**
**../support/pages/salesOrder.js includes functions for sales orders testing.**

**../support/command file has functions that can be reachable from anywhere.**

**.prettierrc file has format settings.**
