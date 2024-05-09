const express = require('express')
const router = express.Router()
const {CreateUser,GetAllUser,GetUser,  DeleteUser, PatchUser, LoginUser} = require('../controller/usercontroller')
const {authjwt} = require('../middleware/authMiddleware')
const {isValidObjectId} = require('../exceptions/objectid')

router.get('/users',  GetAllUser)
router.post('/users',  CreateUser) 
router.get('/user/:id',authjwt, isValidObjectId, GetUser)
//router.put('/user/:id', PutUser)
router.patch('/user/:id',authjwt, isValidObjectId, PatchUser)
router.delete('/user/:id',authjwt,isValidObjectId, DeleteUser)   
router.post('/user/login', LoginUser)

module.exports = router 