const mongoose = require('mongoose')

const productShema = new mongoose.Schema({
    productName : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        default : true
    },
    productOffer: {
        type: Number,
        default : 0
    },
    quantity: {
        type: Number,
        default : true
    },
    color: {
        type: String,
        required: true
    },
    productImage: {
        type: [String],
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Available", "Out of stock", "Discontinued", "In stock"],
        required : true,
        default: "In stock"
    },
  

} , {timestamps: true});


module.exports = mongoose.model('Product',productShema);