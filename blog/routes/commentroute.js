const express = require('express')
const { CreateComment, GetAllComment, GetComment, PatchComment, DeleteComment, GetPostComment, getPostComment } = require('../controller/commentcontroller') //GetPostComment
const router = express.Router()
const {authjwt} = require('../middleware/authMiddleware')
const  {IsUserC,IsUserP} = require('../permissions/authorise')
const {isValidObjectId} = require('../exceptions/objectid')

router.get('/comments', GetAllComment )
router.post('/comments', authjwt, CreateComment )
router.get('/comment/:id',isValidObjectId, authjwt, IsUserC, GetComment )
router.patch('/comment/:id',isValidObjectId, authjwt, IsUserC, PatchComment )
router.delete('/comment/:id',authjwt, isValidObjectId, IsUserC,  DeleteComment ) 
router.get('/comment/post/:id',authjwt, isValidObjectId, IsUserP,  GetPostComment)

module.exports = router