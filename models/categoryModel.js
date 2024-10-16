const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'name is required field'],
        unique: true
    },

    description:{
        type: String,
        required: true
    },

    isListed: {
        type: Boolean,
        default: false
    },
    categoryOffer:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Category',categorySchema)