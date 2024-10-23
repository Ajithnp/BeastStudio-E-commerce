const express = require('express')
const adminRoute = express.Router()
const auth = require('../middleware/auth')

const adminController = require('../controllers/admin/adminController')
const customerController = require('../controllers/admin/customerContoller')

// Page error handler..!
adminRoute.route('/pageError')
       .get(adminController.pageError)

// Admin login .....!
adminRoute.route('/login')
       .get(adminController.loadLogin)
       .post(adminController.verifyLogin)


// Admin dashboard.....!  base route 
adminRoute.route('/')
       .get(auth.adminAuth, adminController.loadDashboard)

// Admin logout 
adminRoute.route('/logout')
      .post(adminController.logout)  
      
// Customer managemaent
adminRoute.route('/users')
       .get(auth.adminAuth, customerController.customerInfo) 
       
 // Customer block route
 adminRoute.route('/blockCustomer')
        .get(auth.adminAuth, customerController.customerBlocked);
        
// Customer unblock route        
adminRoute.route('/unblockCustomer')
        .get(auth.adminAuth, customerController.customerunBlocked);



        
module.exports = adminRoute       