
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'name is required field']
    },
    email:{
        type: String,
        required: [true, 'email is required field'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone:{
        type: Number,
        required: [true, 'phone is required field'],
        unique: true
    },
    password:{
        type: String,
        required: false
    },

    googleId:{
        type:String,
        unique:true
    },

    isBlocked:{
        type: Boolean,
        default: false 
    }

})

module.exports = mongoose.model('User',userSchema)