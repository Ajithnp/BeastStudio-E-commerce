const Brand = require('../../models/brandModel')
const Product = require('../../models/productModel')

// Get brand page handler....!

exports.getBrandPage = async(req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =4;
        const skip = (page-1)*limit;
        const brandData = await Brand.find({}).sort({createdAt: -1}).skip(skip).limit(limit);
        const totalBrands = await Brand.countDocuments();
        const totalPages = Math.ceil(totalBrands/ limit);
        const reverseBrand = brandData.reverse();
        res.render('admin/brands', {
            data : reverseBrand,
            currentPage: page,
            totalPages : totalPages,
            totalBrands: totalBrands
        })
    } catch (error) {
        console.error('Error occured while loadinf the brands page',error.message)

        
        
    }
}

// Add brand handler
exports.addBrand = async (req, res)=>{
    try {
        const brand = req.body.name;
        const findBrand = await Brand.findOne({brand});

        if(! findBrand) {
            const image = req.file.filename;
            const newBrand = new Brand({
                brandName: brand,
                brandImage: image
            })
            // Save brand
            await newBrand.save()
            res.redirect('/admin/brands')
        }
    } catch (error) {
        console.error('Error while adding new brand', error.message)
        
    }
}

// List brand handler
exports.blockBrand = async (req, res)=>{
    try {
        let id = req.query.id
       
        await Brand.updateOne({_id: id},{$set : {isBlocked: true}})
        res.redirect('/admin/brands');
    } catch (error) {
        console.error('Error occured while blocking brand',error.message)

        
    }
}

//Unlist brand handler
exports.unBlockBrand = async(req, res)=>{
    try {
        let id = req.query.id;
        console.log(id);
        await Brand.updateOne({_id: id},{$set :{isBlocked:false}})
        res.redirect('/admin/brands')
    } catch (error) {
        console.error('Error while unblocking brand ',error.message)
        
    }
}
