const Category = require('../../models/categoryModel')
const Product = require


// Category Info handlet-----!
exports.categoryInfo = async (req, res )=>{
    try {
        const page  = parseInt( req.query.page ) || 1;
        const limit = 4;
        const skip = (page-1)*limit;

        const categoryData = await Category.find({})
        .sort({ createdAt: -1 })
        .skip( skip )
        .limit( limit );

       // Find total number of Categories...!
        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit );
        res.render('admin/category', {
            cat: categoryData,
            currentPage: page,
            totalPages: totalPages,
            totalCategories: totalCategories
        });

    } catch (error) {
        console.error('Error occured while loading the category page', error.message)
        
    }
};

// Category add (post) handler-----------!

exports.addCategory = async (req, res )=>{
    try {
        const { name , description }= req.body;

        //Find category exists or not...!
        const existingCategory = await Category.findOne({name})
        if ( existingCategory ) {
          return  res.status(400).json({ error : "Category already exists..!"})
        }
        // Save category
        const newCategory = new Category({
            name,
            description
        })
        await newCategory.save();
        return res.json({message :"Category added successfully ...!"})
    } catch (error) {
        console.error('Error occured while adding category...!', error.message)
        return res.status(500).json({ error: "Internal server error...!"})
        
    }

};

// Category offer add handler -----------!
exports.addCategoryOffer = async (req, res)=>{
    try {
        const percentage = parseInt (req.body.percentage);
        const categoryId = req.body.categoryId;
        const category = await Category.findById(categoryId);

        if(!category) {
            return res.status(404).json({status: false, message: 'Category not found'});
        }
        const products =await Product.find({category: category._id});
        // Check already have offer
        const hasProductOffer = products.some((product)=>product.productOffer > percentage );

        if( hasProductOffer) {
            return res.json({status: false, message: "Products within this category already have product offer"})
        }
        await Category.updateOne({_id: categoryId}, {$set: {categoryOffer: percentage}});

        // Set offer zero (category have offer dno't need of product offer)
        for(let product of products ) {
            product.productOffer = 0;
            product.salePrice = product.regularPrice;  //normal price
            await product.save()
        }
        res.json({status : true});
    } catch (error) {
        console.error('Error while adding category offer', error.message)
        res.status(500).json({status: false , message: 'Internal server Error'});
        
    }
};

// Remove category offer handler
exports.removeCategoryOffer = async (req, res)=>{
   try {
    //Find C: Id..!
    const categoryId = req.body.categoryId;
    const category = await Category.findById(categoryId)

    if(! category ) {
        return res.status(401).json({status: false , message: 'Category not found'})
    }
    const percentage = category.categoryOffer;
    const products = await Product.find({category: category._id});

    // Remove category offer from product..!
    if (products.length > 0) {
        for(const product of products){
            products.salePrice += Math.floor(product.regularPrice * (percentage/100));
            product.productOffer = 0;
            await product.save();
        }
    }
    category.categoryOffer = 0;
    await category.save();
    res.json({status : true});

   } catch (error) {
    console.error('Error while removing category offer')
    res.status(500).json({ status : false, message: 'Internal Server Error'})
    
   }
}

// Get listed category handler ----!
exports.getListCategory = async(req, res)=>{
    try {
        let id = req.query.id;
        await Category.updateOne({_id: id}, {$set: {isListed: false}});
        res.redirect('/admin/category');
    } catch (error) {
        console.error('Error while listing category', error.message)
        // res.status(500)
        
    }
}

//Get unlist Category

exports.getUnlistCategory = async(req, res)=>{
    try {
        let id = req.query.id;
        await Category.updateOne({_id: id},{$set: {isListed:true}})
        res.redirect('/admin/category')
    } catch (error) {
        console.error('Error while unlisting category')
        
    }
}

//Edit category get handler---!
exports.getEditCategory = async (req, res)=>{
    try {
        let id = req.query.id;
        const category = await Category.findOne({_id: id})
        res.status(200).render('admin/edit-category',{category: category});
    } catch (error) {
        console.error('Error while loading edit category page', error.message);

        
    }
}

// Edit category post handler----!
exports.editCategory = async (req, res)=>{
    try {
        const id = req.params.id;
        const {categoryName , description}= req.body
        const existingCategory = await Category.findOne({name: categoryName});

        if (existingCategory) {
            return res.status(400).json({error: 'Category exists, please choose another name'})
        }

        const updateCategory = await Category.findByIdAndUpdate(id,{
            name: categoryName,
            description: description
        },{new: true});  // The new argument used to retuen the updated document..!

        if(updateCategory) {
            res.redirect('/admin/category');
        }else{
            res.status(401).json({error: 'Category not found'})
        }
    } catch (error) {
        console.error('Error while editing category',error.message)
        res.status(500).json({error:'Internal server error'})
        
    }
}
