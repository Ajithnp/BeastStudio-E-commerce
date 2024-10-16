const User = require('../models/userModel')
const Admin = require('../models/adminModel')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

// hashing password
const securePassword = async(password)=>{
    try{
        const passwordHashed = await bcrypt.hash(password,10)
        return passwordHashed
    }catch(error){
        console.log(error.message)
    }
}

exports.loadPageNotFound= async(req,res)=>{
    try {
        return res.status(404).render('user/error404')
    } catch (error) {
        console.log('Error loading 404 page: ',error.message);
        res.status(500).redirect('/pageNotFound')
    
    }
}

//for loading home page
exports.loadHomePage = async(req,res)=>{
    try {
        return res.status(200).render('user/home')
        
     
    } catch (error) {
        console.error('Error loading login page: ',error.message)

        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the login page."
        })
    }
}