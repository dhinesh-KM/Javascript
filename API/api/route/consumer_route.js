const express = require('express')
const router = express.Router()
const {CreateUser,GetAllUser,VerifyUser} = require('../controller/consumer_ctrl')
const v = require('../validation/validator')
const s = require('../validation/schema')


//router.post('/apilogin', views.Login.as_view()),
router.get('/all',  GetAllUser)
router.post('/register', v.validate_payload(s.RegisterSchema), CreateUser)
router.patch('/register/:verify_type/token/:token_type', v.validate_payload_url, VerifyUser )


module.exports = router 