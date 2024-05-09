const mongoose = require('mongoose')
const Comment = require('../models/comment')


const postschema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength:50 },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        publication_date: { type: Date, default: Date.now },
        comments: [{ type: String}],
        comments_o: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
    })



postschema.methods.GetPostData = function(){
    return {
        id: this._id,
        title : this.title,
        content : this.content,
        author : this.author,
        publication_date : this.publication_date,
        comments : this.comments
    }
}

postschema.pre('deleteOne', async function (next)  {
    const {_id} = this.getFilter()
    await Comment.deleteMany({ post_o: _id });
    next();
});




const Post = mongoose.model('Post', postschema)




module.exports = Post

