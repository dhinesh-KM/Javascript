const mongoose = require('mongoose')

const userschema =  new mongoose.Schema(
    {
        username: { type: String, required: true, maxlength:7 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true 
    }
)

const User = mongoose.model('User', userschema)

module.exports = User