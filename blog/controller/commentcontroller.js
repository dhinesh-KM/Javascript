const  Comment  = require('../models/comment')


const CreateComment = async (req, res) => {
    const {post,user,comment} = req.body;
    try{
        const com = new Comment({post:post,user:user,comment:comment})
        await com.save()
        res.status(201).json({'msg': "comment created successfully",'data':com})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log(err.message)
    }
}

const GetAllComment = async (req,res) => {
    const com = await Comment.find()
    res.status(200).json({'data': com})
}

const GetComment = async (req,res) => {
    const {id} = req.params
    console.log
    try{
        const com = await Comment.findById(id)
        if (!com){
            return res.status(404).json({'msg': `comment with id "${id}" not found.` })
        }
        res.status(200).json({'data':com})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
}

const PatchComment = async (req,res) => {
    const {id} = req.params
    let update = req.body

    try{
        const com = await Comment.findByIdAndUpdate(id, update, {new:true} )
        if (!com){
            return res.status(404).json({'msg': `comment with id "${id}" not found.` })
        }
        res.status(200).json({'msg' : 'comment updated successfully', 'data': com})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log(err.message)
    }
    
}

const DeleteComment = async (req,res) => {
    const {id} = req.params
    try{
        const result = await Comment.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({'msg': `comment with id "${id}" not found.` })
            
        }
        res.status(200).json({ 'msg': 'comment deleted successfully' });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})
    }

}

module.exports = {CreateComment, GetAllComment, GetComment, PatchComment, DeleteComment}