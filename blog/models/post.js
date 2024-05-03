const mongoose = require('mongoose')

const postschema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength:50 },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        publication_date: { type: Date, default: Date.now }
    })




const Post = mongoose.model('Post', postschema)

module.exports = Post

