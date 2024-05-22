const Joi = require('joi')


const RegisterVerifySchema = Joi.object(
    {
        mobile : Joi.string(),
        email : Joi.string().email(),
        token : Joi.string()
    }
).xor('email','mobile').messages({'object.missing':'Either Email OR Mobile is required'})

const RegisterSchema = Joi.object(
    {
        first_name : Joi.string().required(),
        last_name : Joi.string().required(),
        country : Joi.string().required(),
        email : Joi.string().email(),
        mobile : Joi.string(),
        password : Joi.string().required(),
        confirm_password : Joi.string().valid(Joi.ref('password')).required().messages({'any.only': 'Passwords does not match.'})
    }
).xor('email','mobile').messages({'object.missing':'Either Email OR Mobile is required'});

module.exports = {RegisterSchema,RegisterVerifySchema}