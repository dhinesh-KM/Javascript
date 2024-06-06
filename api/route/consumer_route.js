const express = require('express')
const router = express.Router()
const control = require('../controller/consumer_ctrl')
const v = require('../validation/validator')
const s = require('../validation/schema')


//router.post('/apilogin', views.Login.as_view()),
router.get('/all',  control.GetAllUser)
router.post('/register', v.validate_payload(s.RegisterSchema), control.CreateUser)
router.patch('/register/:verify_type/token/:token_type', v.types_validate, control.Register_Verify )
router.patch('/:cofferid/profile/update',v.validate_payload(s.ProfileUpdateSchema), control.UpdateUser)
router.patch('/:cofferid/profile/:verify_type',v.verify_type_validate , control.Update_Verify)
router.get('/:cofferid', control.GetUser)

router.get('/ethinicity', control.GetEthinicity)
router.get('/bloodgroup', control.GetBloodgroup)

module.exports = router 