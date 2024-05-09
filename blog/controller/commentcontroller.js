const  Comment  = require('../models/comment')
const  Post  = require('../models/post')
const  User  = require('../models/user')


const CreateComment = async (req, res) => {
    const {post,comment} = req.body;
    const user = req.user.userid



    try{
        const p = await Post.findById(post)
        const u = await User.findById(user)

        if (!p){
            return res.status(404).json({'msg': `post with id "${post}" not found.` })
        }
        
        const com = new Comment({post:p.title, post_o:post, user:u.username, user_o:user, comment:comment})
        await com.save()

        await Post.updateOne({ _id: post},{ $push: { comments:comment, comments_o:com}})

        res.status(201).json({'msg': "comment created successfully",'data':com.GetCommentData()})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        
    }
}

const GetAllComment = async (req,res) => {
    const com = await Comment.find().select('-__v -post_o -user_o')
    res.status(200).json({'data': com})
}



const GetComment = async (req,res) => {
    const {id} = req.params
    try{
        const com = await Comment.findById(id)
        res.status(200).json({'data':com.GetCommentData()})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
}

const PatchComment = async (req,res) => {
    const {id} = req.params
    let update = req.body

    try{
        const b_com = await Comment.findById(id)
        const a_com = await Comment.findByIdAndUpdate(id,update,{new:true})
        await Post.updateOne({_id:b_com.post_o,comments:b_com.comment},{ $set: { "comments.$": update.comment}})
        res.status(200).json({'msg' : 'comment updated successfully', 'data': a_com.GetCommentData()})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
    
}

const DeleteComment = async (req,res) => {
    const {id} = req.params
    try{
        const com = await Comment.findByIdAndDelete(id)
        await Post.updateOne({_id:com.post_o}, { $pull: { comments: com.comment, comments_o: id}})
        res.status(200).json({ 'msg': 'comment deleted successfully' });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})
    }

}

const GetPostComment = async (req,res) => {
    const {id} = req.params
    try{
        const post = await Post.findById(id,'title content author comments')
        // using populate
        //const post = await Post.findById(id).select('-__v  -comments ').populate({ path: 'comments_o',select: '-__v -post_o -user_o',  as: 'comments' })
        //post.comments_o = post.comments_o.map(commentObj => commentObj.comment); 

        if (!post) {
            return res.status(404).json({'msg': `post with id "${id}" not found.` })
        }
        res.status(200).json({ 'data': post });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})

    }
}

const getPostComment = async (req,res) => {
    const {id} = req.params
    try{
        const post = await Comment.find({post_o:id}).select('-__v -post_o -user_o')
        if (!post) {
            return res.status(404).json({'msg': `post with id "${id}" not found.` })
        }0
        res.status(200).json({ 'data': post });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log("ppppp",err.message)
    }
}



module.exports = {CreateComment, GetAllComment, GetComment, PatchComment, DeleteComment, GetPostComment,  getPostComment} //GetPostComment,