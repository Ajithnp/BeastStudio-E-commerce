const mongoose = require('mongoose')


const adminSchema =new mongoose.Schema({
    email: {
        type: String,
        required: [true,'email is required field!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required feild!']
    }
})


module.exports = mongoose.model('admin',adminSchema)

