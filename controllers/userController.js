const User = require('../models/userModel')
const dotenv = require("dotenv").config()
const nodemailer = require('nodemailer')
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
        console.error('Error loading home page: ',error.message)

        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the home page."
        })
    }
}
//user login page handler
exports.loadLogin = async(req,res)=>{
    try {
        return res.status(200).render('user/login')
        
    } catch (error) {
        console.log('Error loading login page');
        
        res.status(500).json({
            status:"fail",
            message:"An error occured while loading the login page"
        })
        
    }
}

// User login post Handler.

exports.verifyLogin = async (req , res)=>{

    try {
        const {userName, password}=req.body
        
        //Conditions checking..
        // User already exist..!
        const user = await User.findOne({email:userName});

        if (! user){
           return res.status(401).json({message: "User not found..!"})
        }
        // Blocked user or not!
        if (user.isBlocked){
            return res.status(401).json({message: "You are blocked..!"})
        }

        //Password match..!
        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword){
            return res.status(401).json({message: "Password do not match..!"})
        }

        // Store user details in session..!
        req.session.user = {id: user._id, name: user.name }
        res.status(200).json({message: "Login successful..!",user: req.session.user});

    
        
    } catch (error) {
        console.error("Login error: ",error);
        
        res.status(500).json({message: "Internal server error...!"})
        
    }
}


//User signup page get handler
exports.loadSignupPage= async(req,res)=>{
    try {
         res.status(200).render('user/signup')
        
    } catch (error) {
        console.log('Error loading signup page',error);
        
        res.status(500).json({
            status:"fail",
            message:"An error occured while loading the signup page"
        })
        
    }
}

// Create a transporter 
const transporter = nodemailer.createTransport({
    service: 'gmail', // service
    auth: {
        user: process.env.NODEMAILER_EMAIL, 
        pass: process.env.NODEMAILER_PASSWORD, 
    },
});

// signup post method handler

exports.addUser= async(req,res)=>{
    try {
        const { email, password ,}=req.body
    
        //checking the email already exixst
        const findUser = await User.findOne({email})
        if (findUser) {
            return res.status(400).json({ success: false,   message: "Email already exists" });
        }
        // Hashing password
        const sPassword=  await securePassword(password)
        // store user data in session
        let userData ={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phonenumber,
            password1:sPassword

        }
        req.session.userData=userData
        
         // Generates a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
         console.log(`Your OTP is: ${otp}`);

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL, // Sender address
            to: email,
            subject: 'OTP send succesfully', // Subjet
            text: `This is your OTP ${otp}` // text body
        };

        // Send OTP email
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
       
        
        // store OTP in session 
        const otpExpirationDuration = 3 * 60 * 1000
        req.session.otp=otp
        
         // Send success response to frontend
         res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.log('Signup error', error);
        
        res.status(500).json({ success: false,  message: "Internal server error"   });
    }
 
}


//OTP resend Handler
exports.resendOtp = async (req, res)=>{
    try{
        if (! req.session.userData || !req.session.userData.email) {
            return res.status(400).json({  success : false,  message: "User data not Found"  });
        }

        const {email} = req.session.userData // Get email from session

        const otp = Math.floor(1000 + Math.random() * 9000);  //Genarate new OTP
        console.log(`Your new OTP is: ${otp}`);

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL, // Mail options for send
            to: email,
            subject: 'Otp Resend succesfully', 
            text: `This is your new OTP ${otp}` 
        };

        await transporter.sendMail (mailOptions) // Send new OTP mail
        console.log('New OTP send successfully');

        // Update session with new OTP 
        req.session.otp=otp
   
        
        res.status(200).json({  success: true,  message: "OTP send successfully" });
          
    }catch(error){
        console.log("Error occured while resending OTP", error);
        res.status(500).json({success: false, message: "Failed send OTP" });
    }
};

// Get Otp handler
exports.getOtp = async (req, res)=>{
    try {
        res.render('user/userOtp', { otpExpTime: req.session.otpExpTime}); // Pass the expiration time toEJS

    } catch (error) {
        console.log('Error',error);
        res.status(500).json({success: false, message:"An error occured while loading the otp page"})
            
    }
}


// OTP receive handler

exports.verifyOtp = async (req, res)=>{
    try {
        const {otp} = req.body
        const sendOtp = req.session.otp?.toString()

        // console.log('receivedotp',otp, typeof otp);
        // console.log('storedotp',sendOtp, typeof sendOtp)
     
        // conditions checking
     
        //Check the entered OTP valid or not! 

        if(!otp  || otp !==sendOtp){
            return res.status(400).json({success: false , message:"OTP not valid, Please try again"});
                
        }
        // save userData to database
        const getUser = req.session.userData
    
        const user = new User({
            name:getUser.name,
            email:getUser.email,
            phone:getUser.phone,
            password:getUser.password1
            
        })

        await user.save()

        //  Clear OTP from session after successful verification
         delete req.session.otp;
         delete req.session.otpExpTime;
         delete req.session.userData;

         return res.status(200).json({success: true, message: 'Registration successfull'});
                
    } catch (error) {
        console.error('OTP verification failed',error)

        res.status(500).json({success: false, message:"An error occured while verifying the otp" });
    }
};