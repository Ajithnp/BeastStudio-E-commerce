const express = require('express')
const adminRoute = express.Router()


const adminController = require('../controllers/admin/adminController')
const customerController = require('../controllers/admin/customerContoller')
const categoryController = require('../controllers/admin/categoryController')
const brandController = require ('../controllers/admin/brandController');
const productController = require('../controllers/admin/productController')
//Auth middleware
const auth = require('../middleware/auth')

const multer = require("multer")
const storage = require('../helpers/multer');
const uploads = multer({storage: storage});


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

// Category Management------------------!

adminRoute.route('/category')
       .get(auth.adminAuth, categoryController.categoryInfo)
       .post(auth.adminAuth, categoryController.addCategory)  // route- add category

//Categort offers Add and Remove.
adminRoute.route('/addCategoryOffer')
       .post(auth.adminAuth, categoryController.addCategoryOffer)

adminRoute.route('/removeCategoryOffer')
       .post(auth.adminAuth, categoryController.removeCategoryOffer)       

// Category  List and Unlist handler.
adminRoute.route('/listCategory')
        .get(auth.adminAuth,categoryController.getListCategory) 
        
adminRoute.route('/unlistCategory')
        .get(auth.adminAuth, categoryController.getUnlistCategory);        


         // Edit category handler.
  adminRoute.route('/editCategory')
         .get(auth.adminAuth,categoryController.getEditCategory)

adminRoute.route('/editCategory/:id')
         .get(auth.adminAuth,categoryController.editCategory)
                  
 // Brand management------------------------------!     

 adminRoute.route('/brands')
           .get(auth.adminAuth,brandController.getBrandPage)
 
           //Brand add handler...!
adminRoute.route('/addBrand')           
        .post(auth.adminAuth,uploads.single('image'),brandController.addBrand);

        //Brand list handler
adminRoute.route('/blockBrand')
        .get(auth.adminAuth,brandController.blockBrand)        
     

       // Brand unlist
adminRoute.route('/unBlockBrand')
       .get(auth.adminAuth,brandController.unBlockBrand)    

// Product Management-----------!
adminRoute.route('/addProducts') 
       .get(auth.adminAuth,productController.getAddProductPage)      

       //Product add route
adminRoute.route('/addProducts')
        .post(auth.adminAuth, uploads.array('images',4),productController.addProducts ) ;      
      
        // Get all products
adminRoute.route('/products')
      .get(auth.adminAuth,productController.getAllProducts) ;        

      //Add product offer
adminRoute.route('/addProductOffer')
         .post(auth.adminAuth,productController.addProductOffer);      

         //Remove product offer
adminRoute.route('/removeProductOffer')
       .post(auth.adminAuth,productController.removeProductOffer);        
       
       //Block product
adminRoute.route('/blockProduct')       
       .get(auth.adminAuth,productController.blockProduct);

       //Unblock product
adminRoute.route('/unblockProduct')
       .get(auth.adminAuth,productController.unblockProduct); 
       
       //Edit product
adminRoute.route('/editProduct')
        .get(auth.adminAuth, productController.getEditProduct)  ;     

        //post
adminRoute.route('/editProduct/:id')  
      .post(auth.adminAuth,uploads.array('images',4),productController.editProduct);     
      
      // product image delete
adminRoute.route('/deleteImage')
      .post(auth.adminAuth,productController.deleteSingleImage) ;


        
module.exports = adminRoute       