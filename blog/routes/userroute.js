const express = require('express')
const router = express.Router()
const {CreateUser,GetAllUser,GetUser,  DeleteUser, PatchUser} = require('../controller/usercontroller')

router.get('/users', GetAllUser)
router.post('/users',  CreateUser)
router.get('/user/:id', GetUser)
//router.put('/user/:id', PutUser)
router.patch('/user/:id', PatchUser)
router.delete('/user/:id', DeleteUser)   

module.exports = router 