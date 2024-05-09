const  User  = require('../models/user')
const  Comment  = require('../models/comment')
const  Post  = require('../models/post')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretkey = require('crypto').randomBytes(32).toString('hex')


const CreateUser = async (req, res) => {
    const {username, email, password} = req.body;
    const hashpassword = await bcrypt.hash(password,10);

    try{
        const user = new User({username:username,email:email,password:hashpassword})
        await user.save()
        res.status(201).json({'msg': "User created successfully",'data':user})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log(err.message)
    }
}

const GetAllUser = async (req,res) => {
    const users = await User.find()
    res.status(200).json({'data': users})
}

const GetUser = async (req,res) => {
    const {id} = req.params

    try{
        const user = await User.findById(id)
        if (!user){
            return res.status(404).json({'msg': `user with id "${id}" not found.` })
        }
        res.status(200).json({'data':user})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
}

/*const PutUser = async (req,res) => {
    const {id} = req.params
    const {username,email,password} = req.body
    console.log(username,email,password)
    const hashpassword = await bcrypt.hash(password,10);

    if(!username || !email || !password){
        return res.status(400).json({'msg': 'please provide ' })
    }
    try{
        const user = await User.findByIdAndUpdate (id, {username,email,password:hashpassword}, {new:true} )
        if (!user){
            return res.status(404).json({'msg': `user with id "${id}" not found.` })
        }
        res.status(200).json({'data': user})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
    
}*/

const PatchUser = async (req,res) => {
    const {id} = req.params
    let update = req.body
    if (req.body.password != undefined){
         update.password = await bcrypt.hash(req.body.password,10);
    }
    try{
        const user = await User.findByIdAndUpdate (id, update, { runValidators: true, new: true } )
        if (!user){
            return res.status(404).json({'msg': `user with id "${id}" not found.` })
        }
        if (req.body.username != undefined){
            await Comment.updateMany({user_o:req.userid}, {user: user.username})
       }
        
        res.status(200).json({'msg' : 'user updated successfully', 'data': user})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
    }
    
}


const DeleteUser = async (req,res) => {
    const {id} = req.params
    try{
        const result = await User.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({'msg': `user with id "${id}" not found.` })
        }
        await Post.deleteMany({author:id})
        await Comment.deleteMany({user_o:id})
        res.status(200).json({ 'msg': 'User deleted successfully' });
    }   
    catch(err){
        res.status(500).json({'msg': err.message})
    }

}

const LoginUser = async (req,res) => {
    try{
        const {username,password} = req.body

        const user = await User.findOne({username})
        if (user == null){
            return res.status(404).json({'msg': `user with the username "${username}" not found.` })
        }
        const pswrd = await bcrypt.compare(password,user.password)
        if(!pswrd){
            return res.status(404).json({'msg': 'password is incorrect' })
        }
        const token = jwt.sign({ userid: user._id, username: user.username}, secretkey, {'expiresIn': '1h'}  )
        res.status(200).json({'msg': 'login successfully',token,'data': {id:user._id, username:username, email:user.email}})
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log(err.message)
    }

}
 
module.exports = { CreateUser, GetAllUser, GetUser, PatchUser, DeleteUser, LoginUser, secretkey}