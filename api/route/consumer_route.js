const express = require('express')
const router = express.Router()
const control = require('../controller/consumer_ctrl')
const v = require('../validation/validator')
const s = require('../validation/schema')


//router.post('/apilogin',  views.Login.as_view()),
//Register 
router.get('/all',   control.GetAllUser)
router.post('/register',  v.validate_payload(s.RegisterSchema),  control.CreateUser)
router.patch('/register/:verify_type/token/:token_type',  v.types_validate,  control.Register_Verify )

//profile
router.patch('/:cofferid/profile/update', v.validate_payload(s.ProfileUpdateSchema),  control.UpdateUser)
router.patch('/:cofferid/profile/:verify_type', v.validate_payload(s.TokenSchema) ,  control.Update_Verify)
router.get('/:cofferid',  control.GetUser)

//Forgot password
router.patch('/forgot/:verify_type', v.forget_validator, control.ForgotPswrd)
router.patch('/forgot/:verify_type/token/:token_type', v.forget_check_validator, control.ForgotPswrdCheck)

//Reminders
router.post('/reminder/:cofferid', v.validate_payload(s.ReminderSchema), control.CreateReminder)


router.get('/ethinicity',  control.GetEthinicity)
router.get('/bloodgroup',  control.GetBloodgroup)

module.exports = router 