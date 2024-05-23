const {Consumer} = require('../models/consumer')
const db = require('../dboperations')


const CreateUser = async (req, res) => {
    const data = req.body
    try{
        
        const result = await db.consumer_create(data)
        const status = result.status
        delete result.status
        res.status(status).json(result)
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log("error",err.message,err)
    }
}

const VerifyUser = async (req, res) => {
    const data = req.body
    const{verify_type,token_type} = req.params
    
    try{
        const result = await db.consumer_registration_verify_section(verify_type,token_type,data)
        const status = result.status
        delete result.status
        res.status(status).json(result)
    }
    catch(err){
        res.status(500).json({'msg': err.message})
        console.log("error",err.message)
    }
}


const GetAllUser = async (req,res) => {
    const users = await Consumer.find().select("-_id -password -__v ")
    res.status(200).json({'error' : false, 'data': users})
}

module.exports = {CreateUser, GetAllUser, VerifyUser}