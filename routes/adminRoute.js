const express = require('express')
const adminRoute = express.Router()

const adminController = require('../controllers/adminController')

adminRoute.route('/')
       .get(adminController.loadLogin)
       .post(adminController.verifyLogin)
   
adminRoute.route('/dashboard')
       .get(adminController.loadDashboard)

module.exports = adminRoute       