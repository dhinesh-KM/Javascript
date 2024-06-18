const express = require('express');
const router = express.Router();
const control = require('../controller/consumer_ctrl');
const v = require('../validation/validator');
const s = require('../validation/schema');
const authjwt = require('../middleware/authmiddleware');
const IsUser = require('../middleware/permission')

//router.post('/apilogin',  views.Login.as_view()),
//Register 
router.get('/all',   control.GetAllUser);
router.post('/register',  v.validate_payload(s.RegisterSchema),  control.CreateUser);
router.patch('/register/:verify_type/token/:token_type',  v.types_validate,  control.Register_Verify );

//profile
router.patch('/profile/update',authjwt, v.validate_payload(s.ProfileUpdateSchema),  control.UpdateUser);
router.patch('/profile/:verify_type',authjwt, v.validate_payload(s.TokenSchema) ,  control.Update_Verify);
router.get('/profile', authjwt, control.GetUser);

//Forgot password
router.patch('/forgot/:verify_type/token/send', v.forget_validator, control.ForgotPswrd);
router.patch('/forgot/:verify_type/token/:token_type', v.forget_check_validator, control.ForgotPswrdCheck);

//Reminders
router.post('/reminders/add',authjwt, v.validate_payload(s.ReminderSchema), control.CreateReminder);
router.get('/reminders', authjwt, control.GetReminder);
router.delete('/reminders/:remid/delete', authjwt, IsUser, control.DeleteReminder);


router.get('/ethinicity',  control.GetEthinicity);
router.get('/bloodgroup',  control.GetBloodgroup);

module.exports = router 