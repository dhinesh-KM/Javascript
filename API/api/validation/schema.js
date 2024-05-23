const Joi = require('joi')

const EmailVerifySchema = Joi.object(
    {
        email : Joi.string().email().required().messages({'string.email': 'Invalid email address'}),
        token : Joi.string().required()
    }
)

const MobileVerifySchema = Joi.object(
    {
        mobile : Joi.string().required(),
        token : Joi.string().required()
    }
)

const EmailResendSchema = Joi.object(
    {
        email : Joi.string().email().required().messages({'string.email': 'Invalid email address'}),
    }
)

const MobileResendSchema = Joi.object(
    {
        mobile : Joi.string().required(),
    }
)


const RegisterSchema = Joi.object(
    {
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        country : Joi.string().required(),
        email : Joi.string().email().messages({'string.email': 'Invalid email address'}),
        mobile : Joi.string().length(10),
        password : Joi.string().required(),
        confirm_password : Joi.string().valid(Joi.ref('password')).required().messages({'any.only': 'Passwords does not match.'})
    }
).xor('email','mobile').messages({'object.missing':'Either Email OR Mobile is required'});

module.exports = {RegisterSchema,EmailVerifySchema,EmailResendSchema,MobileResendSchema,MobileVerifySchema}