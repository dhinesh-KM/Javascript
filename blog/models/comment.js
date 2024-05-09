const mongoose = require('mongoose')


const commentschema = new mongoose.Schema(
    {
        post_o: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        post: { type: String},
        user_o: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        user: { type: String},
        comment: { type: String, required: true },
        comment_at: { type: Date, default: Date.now }
    }
)

commentschema.methods.GetCommentData = function() {
    return {
        id: this._id,
        post: this.post,
        user: this.user,
        comment: this.comment,
        comment_at: this.comment_at

    }
}



/*commentschema.pre('deleteOne', async function (next) {
    const {_id} = this.getFilter()
    const com = await Comment.findById(_id)
    await Post.updateOne(
        {_id: com.post_o}, 
            { $pull: 
                {
                    comments:  com.comment,
                    comments_o:  _id
                }
            })
    next()
})*/

const Comment = mongoose.model('Comment', commentschema)

module.exports = Comment