const  Post  = require('../models/post')


const CreatePost = async (req, res) => {
    const {title,content,author} = req.body;
    try{
        const post = new Post({title:title,content:content,author:author})
        await post.save()
        res.status(201).json({'msg': "post created successfully",'data':post})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
}

const GetAllPost = async (req,res) => {
    const post = await Post.find()
    res.status(200).json({'data': post})
}

const GetPost = async (req,res) => {
    const {id} = req.params
    console.log
    try{
        const post = await Post.findById(id)
        if (!post){
            return res.status(404).json({'msg': `post with id "${id}" not found.` })
        }
        res.status(200).json({'data':post})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
}

const PatchPost = async (req,res) => {
    const {id} = req.params
    let update = req.body

    try{
        const post = await Post.findByIdAndUpdate(id, update, {new:true} )
        if (!post){
            return res.status(404).json({'msg': `post with id "${id}" not found.` })
        }
        res.status(200).json({'msg' : 'post updated successfully', 'data': post})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log(err.message)
    }
    
}


const DeletePost = async (req,res) => {
    const {id} = req.params
    try{
        const result = await Post.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({'msg': `user with id "${id}" not found.` })
            
        }
        res.status(200).json({ 'msg': 'User deleted successfully' });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})
    }

}

module.exports = {CreatePost, GetAllPost, GetPost, PatchPost, DeletePost}