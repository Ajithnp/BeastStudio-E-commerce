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

//   const verifyUser=async (req,res,next)=>{
//     try{
//         const token=jwt.verify({_id:id},{})
//     }
// }