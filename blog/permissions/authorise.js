const Post = require('../models/post')
const Comment = require('../models/comment')

const IsUserC = async (req,res,next) => {
    try{
        const id = req.params.id
        const com = await Comment.findById(id)
        if (!com){
            return res.status(404).json({'msg': `comment with id "${id}" not found.` })
        }
        if (req.user.userid == com.user_o){
            next()
        }
        else{
            return res.status(401).json({"msg": "Unauthorized"})
        }
        
    }
    catch(err){
        res.status(500).json({"msg":err.message})
    }
}

const IsUserP = async (req,res,next) => {
    try{
        const id = req.params.id
        const post = await Post.findById(id)
        if (!post){
            return res.status(404).json({'msg': `post with id "${id}" not found.` })
        }
        if (req.user.userid == post.author){
            next()
        }
        else{
            return res.status(401).json({"msg": "Unauthorized"})
        }
        
    }
    catch(err){
        res.status(500).json({"msg":err.message})
    }
}


 
module.exports = {IsUserC, IsUserP}