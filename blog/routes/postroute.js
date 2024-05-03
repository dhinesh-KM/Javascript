const express = require('express')
const { CreatePost, GetAllPost, GetPost, PatchPost, DeletePost } = require('../controller/postcontroller')
const router = express.Router()

router.get('/post', GetAllPost )
router.post('/post', CreatePost)
router.get('/post/:id',GetPost )
router.patch('/post/:id', PatchPost)
router.delete('/post/:id', DeletePost)

module.exports = router