
const User = require('../models/userModel');
const Admin = require('../models/adminModel')

// Passport
// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next(); // User is authenticated, proceed to the next middleware
//     }
//     res.redirect('/login'); // Redirect to login if not authenticated
//   };
  
//   userRoute.route('/home').get(ensureAuthenticated, (req, res) => {
//     res.send('Welcome to your home page!');
//   });

// User authentication middleware
exports.userAuth = async (req, res, next )=>{
    try{
        // check if user authenticated..!
        if( !req.session.user){
            return res.redirect('/login'); // Redirect if not authenticated..!
        }
        //Find user by ID...!
        const user = await User.findById(req.session.user);

        // Check if user exists and not blocked..!
        if (user && !user.isBlocked) {
            return next() // Proceed to next ...!
        }else {
            res.redirect('/login')  // Redirect if user is blocked or not found..!
        }
    }
    catch(error) {
                console.log('Error in user Authentication',error.message);
                res.status(500).send('Internal server error')
                
            }
};


//Admin authentication..!
exports.adminAuth = async(req, res, next)=>{
    try {
        if (! req.session.admin){
            return res.redirect('/admin/login')
        }
        // Find admin by ID..!
        const admin = await Admin.findById(req.session.admin.id)
       if (admin){
        return next();
       }else{
        return res.redirect('/admin/login')
       }    
    } catch (error) {
        console.error('Error in the user authentication', error.message);
        return res.status(500).send(' Internal  server error') 
    }
}