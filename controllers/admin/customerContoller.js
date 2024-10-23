const User = require('../../models/userModel')

// Customer info get--------!

exports.customerInfo = async (req, res)=>{
    try {
        //  Search button get users
        let search = "";  // Initial value...!
        if( req.query.search ){
            search = req.query.search;
        }

        // Pagination set up...!
        let page =1;
        if ( req.query.page ) {
            page = req.query.page
        }
        const limit = 3
        const userData = await User.find({
            $or : [
                {name :{$regex : ".*"+search+".*"}},
                {email : {$regex : ".*"+search+".*"}},
            ],
        })
        .limit( limit*1 )
        .skip ((page-1)*limit )
        .exec();  // for companing chain of promises

        const count = await User.find({
            $or : [
                {name :{$regex : ".*"+search+".*"}},
                {email : {$regex : ".*"+search+".*"}},
            ],

        }).countDocuments();

        res.render('admin/customers', {
            data: userData,
            totalPages: Math.ceil(count/limit),
            currentPage: page
        })
    } catch (error) {
        console.error('Error while loading customer info ...!',error.message);
        
    }
};

// Customer block handler--------------!
exports.customerBlocked = async (req, res )=> {
    try {
        let id = req.query.id;
        await User.updateOne({_id: id}, {$set: {isBlocked:true}});
        res.redirect('/admin/users')
        
    } catch (error) {
        console.error('Error.. while trying to block user',error.message)

    }
};

// Customer unblock Handler
exports.customerunBlocked = async (req, res )=>{
    try {
        let id = req.query.id;
        await User.updateOne({_id: id},  {$set :{isBlocked: false}});
        res.redirect('/admin/users')
        
    } catch (error) {
        console.log('Error while unblocking user', error.message)
        
    }
}