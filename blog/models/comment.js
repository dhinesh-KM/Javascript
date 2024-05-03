const mongoose = require('mongoose')

const commentschema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        comment: { type: String, required: true },
        comment_at: { type: Date, default: Date.now }
    }
)

const comment = mongoose.model('comment', commentschema)

module.exports = comment