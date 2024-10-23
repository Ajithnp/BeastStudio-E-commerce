const User = require('../../models/userModel')
const Admin = require('../../models/adminModel')
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

// Page error handler...!
exports.pageError = async (req, res)=>{
    
        res.render('admin/adminPage-error')
     
};


// admin log-in page(get)
exports.loadLogin = (req,res)=>{
    try{
        // Check if admin session exist
        if(req.session.admin){
            return res.redirect('/admin/dashboard')
        }

       return res.status(200).render('admin/login', {title: 'Admin Login'});

    }catch(error){
        console.error('Error loading login page: ',error.message)

        res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the login page."
        })
        
    }
};


//Admin verify Handler...!

exports.verifyLogin = async (req, res)=>{
    try{
        const {email , password}=req.body
        
        // Find admin by email...!
        const admin = await Admin.findOne({email:email})
        
        if(!admin){
            return res.status(401).json({ success: false ,message:'Invalid email or password..! '});
        }
        //matching password...!
        const passwordMatch = await bcrypt.compare(password,admin.password);

        if(!passwordMatch){
            return res.status(401).json({success : false, message:'Invalid email or password..!'})
        }
        else{
            // Store admin info in session...!
            req.session.admin = { id: admin._id , email: admin.email};


            return res.status(200).json({success: true , message: 'Log in successful'});

        }
    }catch(error){
        console.error('Error  verifying admin login: : ',error.stack || error.message)
        res.status(500).json({
            success: false,
            message:"An error occurred while processing your request..!"
        });
        
    }
};


// Admin dashboard handler...!
exports.loadDashboard= async(req,res)=>{
    try{
    
        // Check if admin is authenticated...!
        if (! req.session.admin ){
            return res.redirect('/admin/login')
        }
        // Render the dashboard if authenticated..!
        return res.status(200).render('admin/dashboard')
    }catch(error){
        console.error('Error loading dashboard: ',error.stack || error.message)
        return res.status(500).json({
            status:"fail",
            message:"An error occurred while loading the Dasboard page."
        })
    }
}

//Admin logout handler..!
exports.logout = async (req, res) =>{
    try {
        // session destroy
        req.session.destroy((err)=>{
            if( err ) {
                console.log('session destruction error...!', err.message);
                return res.status(500).json({message: ' Could not logout..!'})
                
            }
            res.status(200).json({message : "Logout successfully..!"})
        })
    } catch (error) {
        console.error('Logout error', error);
        res.status(500).json({message: "Internal server error...!"})
        
    }
};

