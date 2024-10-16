const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')

userRoute.route('/pageNotFount')
            .get(userController.loadPageNotFound)

userRoute.route('/')
            .get(userController.loadHomePage)










module.exports = userRoute