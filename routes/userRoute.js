const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/userController')
const passport = require('passport')

userRoute.route('/pageNotFount')
            .get(userController.loadPageNotFound)



userRoute.route('/')
            .get(userController.loadHomePage)
            

userRoute.route('/login')
            .get(userController.loadLogin)
            .post(userController.verifyLogin)



userRoute.route('/signup')
              .get(userController.loadSignupPage)
              .post(userController.addUser)



 userRoute.route('/otp')
                  .get(userController.getOtp)
                  .post(userController.verifyOtp) 
                  
                  

userRoute.route('/resendOtp')
            .post(userController.resendOtp)



// user google sign route
userRoute.route('/auth/google')
             .get(passport.authenticate('google', {scope: ['profile', 'email'] }));
// sign success and failure response
userRoute.route('/auth/google/callback')
              .get(passport.authenticate('google', { failureRedirect: '/signup'}),
              (req,res)=>{
                //successful login
                res.redirect('/');
              }
            );


module.exports = userRoute