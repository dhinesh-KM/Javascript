const express = require('express')
const { CreateComment, GetAllComment, GetComment, PatchComment, DeleteComment } = require('../controller/commentcontroller')

const router = express.Router()

router.get('/comments', GetAllComment )
router.post('/comments', CreateComment )
router.get('/comment/:id', GetComment )
router.patch('/comment/:id', PatchComment )
router.delete('/comment/:id', DeleteComment )

module.exports = router