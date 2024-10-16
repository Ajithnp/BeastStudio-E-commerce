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
// admin log-in page(get)
exports.loadLogin = async(req,res)=>{
    try{
        return res.status(200).render('admin/login', {title: 'Admin Login'});
    }catch(error){
        console.error('Error loading login page: ',error.message)

        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the login page."
        })
        
    }
}


//admin verify Handler-(matching details)

exports.verifyLogin = async(req,res)=>{
    try{
        const {email , password}=req.body

        const adminData = await Admin.findOne({email:email})
        
     
        if(!adminData){
            return res.status(401).render('admin/login',{message:'Invalid email or password '});
        }
        //matching password
        const passwordMatch = await bcrypt.compare(password,adminData.password);

        if(!passwordMatch){
            return res.status(401).render('admin/login',{message:'Invalid email or password'})
        }
        else{
            // Store user info in session
            req.session.admin_id = adminData._id;

          return res.status(200).redirect('admin/dashboard')

        }
    }catch(error){
        console.error('Error loading login page: ',error.stack || error.message)
        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the Dasboard page page."
        })
        
    }
}



exports.loadDashboard= async(req,res)=>{
    try{
       return res.status(200).render('admin/dashboard')

    }catch(error){
        console.error('Error loading login page: ',error.stack || error.message)
        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the Dasboard page."
        })
        

    }
}