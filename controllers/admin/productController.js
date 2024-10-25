const Product = require('../../models/productModel')
// While adding product should can select 'Brand 'and 'Product'
const Category = require('../../models/categoryModel')
const Brand = require('../../models/brandModel')
const User = require('../../models/userModel')

const fs = require('fs')
const  path = require('path')

const sharp = require('sharp') //  for resize Image (witdh and height)
const { error } = require('console')

exports.getAddProductPage =  async(req, res)=>{
    try {
        const category = await Category.find({isListed: true});
        const brand = await Brand.find({isBlocked: false});
        
        res.render('admin/product-add' ,{
            cat: category,
            brand: brand
        });
    } catch (error) {
        console.error('Error while loading add product page',error.message)
    }
}

//Product add route handler...!

exports.addProducts = async(req, res)=>{
    try {
        const products = req.body;
        const productExists = await Product.findOne({
            productName: products.productName,
        });

        if(! productExists){
            const images=[];
        

        if(req.files && req.files.length >0 ){
            for (let i=0; i<req.files.length; i++){
                const originalImagePath = req.files[i].path;
                const resizedImagePath = path.join('public', 'uploads', 're-image' , req.files[i].filename);
                await sharp(originalImagePath).resize({width:440, height:440}).toFile(resizedImagePath);
                images.push(req.files[i].filename);
            }
        }
        const categoryId = await Category.findOne({name: products.category});
        if(!categoryId){
            return res.status(400).json('Invalid category name')
        }
        const newProduct = new Product({
            productName: products.productName,
            description: products.description,
            brand: products.brand,
            category: categoryId._id,
            regularPrice:products.regularPrice,
            salePrice: products.salePrice,
            createdOn : new Date(),
            quantity: products.quantity,
            color: products.color,
            productImage: images,
            status: 'In stock'


        })
        await newProduct.save();
        return res.redirect('/admin/addProducts')

      }else{
        return res.status(400).json('Product already exist, please try witg anoeger name')
      }
    } catch (error) {
        console.error('Error, while adding new produect', error.message)
       
        
    }
}


//Get products handler

exports.getAllProducts = async (req, res )=>{
    try {
        const search = req.query.search || "";
        // Pagination
        const page = req.query.page || 1;
        const limit =4;

        const productData = await Product.find({
            $or: [
                {productName: {$regex: new RegExp(".*"+search+".*","i")}},
                {brand: {$regex: new RegExp(".*"+search+".*","i")}},
            ],
        }).limit(limit*1).skip((page-1)*limit).populate('category').exec();

        const count = await Product.find({
            $or:[
                {productName: {$regex: new RegExp(".*"+search+".*","i")}},
                {brand: {$regex: new RegExp(".*"+search+".*","i")}},
            ],
        }).countDocuments();

        const category = await Category.find({isListed:true});
        const brand = await Brand.find({isBlocked: false})

        if(category && brand){
            res.render('admin/products',{
                data: productData,
                totalPages : Math.ceil(count/limit),
                currentPage: page,
                cat:category,
                brand: brand
          
            })
        }else{
            res.send('fetching datas incompleted')
        }
    } catch (error) {
        console.error('Error while loading product page')
        
    }
}

//Add product offer handler
exports.addProductOffer = async (req, res)=>{
    try {
        const {productId, percentage}=req.body;
        const findProduct = await Product.findOne({_id:productId});
        const findCategory = await Category.findOne({_id:findProduct.category});
        if(findCategory.categoryOffer > percentage){
            return res.json({status: false, message:"This products category already has a category offer"})

        }
        findProduct.salePrice = findProduct.salePrice-Math.floor(findProduct.regularPrice*(percentage/100))
        findProduct.productOffer = parseInt(percentage);
        await findProduct.save();
        findCategory.categoryOffer =0;

        await findCategory.save();
        res.json({status:true});

        
    } catch (error) {
        console.error('Error occured while adding product offer', error.message)
        res.status(500).json({status:false, message: "Internal Server Error"})
        
    }
};

//remove product offer handler
exports.removeProductOffer = async(req, res)=>{
    try {
        const {productId} = req.body
        const findProduct = await Product.findOne({_id:productId});
        const percentage = findProduct.productOffer;
        findProduct.salePrice = findProduct.salePrice+Math.floor(findProduct.regularPrice*(percentage/100))
        findProduct.productOffer = 0;
        await findProduct.save();
        res.json({status:true})
    } catch (error) {
        console.error('Error occured while removing offer',error.message)

    }
}

//Block product handler

exports.blockProduct = async (req, res)=>{
    try {
        let  id = req.query.id
        await Product.updateOne({_id: id},{$set :{isBlocked:true}});
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error occured while blocking product');
        
    }
}

exports.unblockProduct = async (req, res)=>{
    try {
        let id = req.query.id 
        await Product.updateOne({_id: id},{$set :{isBlocked:false}})
        res.redirect('/admin/products')
    } catch (error) {
        console.error('Error while unblocking product', error.message)
        
    }
}

// Get edit product handler-------!
exports.getEditProduct = async (req, res)=>{
    try {
        let id = req.query.id
        const product = await Product.findOne({_id: id});
        const category = await Category.find({});
        const brand = await Brand.find({});
        res.render('admin/product-edit',{
            product: product,
            cat: category,
            brand: brand,
        })
     
    } catch (error) {
        console.error('Error while loading product edit page')
        
    }
}

// Edit product post handler

exports.editProduct = async(req, res)=>{
    try {
        const id = req.params.id;
        const product = await Product.findOne({_id: id});
        const data = req.body

        // Check product is exist
        const existingProduct = Product.findOne({
            productName : data.productName,
            _id: {$ne: id}
        })
        if(existingProduct){
            return res.status(400).json({error: 'Product with this name already exists. please try with another name'});
        }

        const images =[];

        if(req.files && req.files.length > 0){
            for(let i=0; i<req.files.length; i++){
                images.push(req.files[i].filename);
            }
        }

        const updateFields = {
            productName: data.productName,
            description: data.description,
            brand: data.brand,
            category:product.category,
            regularPrice: data.regularPrice,
            salePrice: data.salePrice,
            quantity: data.quantity,
            color: data.color
        }
        if(req.files.length>0){
            updateFields.$push = {productImage: {$each: images}};
        }
        await Product.findByIdAndUpdate(id, updateFields,{new: true});
        res.redirect('/admin/products');
        
    } catch (error) {
        console.error('Error while adding edited product',error.message);
        
    }
}
// Delete single Image handler
exports.deleteSingleImage = async (req, res)=>{
    try {
        const {imageNameToServer, productIdToServer}=req.body;
        // remove image
        const product = await Product.findByIdAndUpdate(productIdToServer,{$pull: {productImage: imageNameToServer}});
        const imagePath = path.join('public','uploads', 're-image', imageNameToServer);

        if(fs.existsSync(imagePath)){
            await fs.unlinkSync(imagePath);
            console.log(`Image ${imageNameToServer}deleted successfully`);
            
        }else{
            console.log(`Image ${imageNameToServer} not found`);
            
        }
        res.send({status: true});
    } catch (error) {
        console.error('Error occured while deleting image',error.message)
        
    }
}

