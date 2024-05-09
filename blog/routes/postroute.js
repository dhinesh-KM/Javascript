const express = require('express')
const { CreatePost, GetAllPost, GetPost, PatchPost, DeletePost } = require('../controller/postcontroller')
const router = express.Router()
const {authjwt} = require('../middleware/authMiddleware')
const  {IsUserP} = require('../permissions/authorise')

router.get('/post', GetAllPost )
router.post('/post',authjwt, CreatePost)
router.get('/post/:id',authjwt, IsUserP, GetPost )
router.patch('/post/:id',authjwt, IsUserP, PatchPost)
router.delete('/post/:id',authjwt, IsUserP, DeletePost)

module.exports = router