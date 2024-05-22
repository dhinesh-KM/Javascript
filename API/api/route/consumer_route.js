const express = require('express')
const router = express.Router()
const {CreateUser,GetAllUser,VerifyUser} = require('../controller/consumer_ctrl')
const {validate_payload} = require('../validation/validator')
const {RegisterSchema,RegisterVerifySchema} = require('../validation/schema')

router.get('/all',  GetAllUser)
router.post('/register', validate_payload(RegisterSchema), CreateUser)
router.patch('/register/:verify_type/token/:token_type', validate_payload(RegisterVerifySchema), VerifyUser )


module.exports = router 