const Joi = require('joi');
const moment = require('moment');


const EmailVerifySchema = Joi.object(
    {
        email : Joi.string().email().required().messages({'string.email': 'Invalid email address'}),
        token : Joi.string().required()
    }
)

const MobileVerifySchema = Joi.object(
    {
        mobile : Joi.string().length(10).required(),
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
).xor('email','mobile').messages({'object.missing':'Either Email OR Mobile is required'}).options({ stripUnknown: true });

const date_validator = (value, helpers) => {
    const date = moment(value, "DD-MM-YYYY");

    if (!date.isValid())
        return helpers.message('Date of birth must be in the format DD-MM-YYYY');

    if ( date.isSameOrAfter(moment(), 'day'))
        return helpers.message("Date of birth must not be in the future");

    return value
}

const ProfileUpdateSchema = Joi.object(
    {
        first_name : Joi.string(),
        last_name : Joi.string(),
        middle_name : Joi.string(),
        email : Joi.string().email().messages({'string.email': 'Invalid email address'}),
        mobile : Joi.string().length(10),
        dob : Joi.string().custom(date_validator, 'custom date validation'),
        old_password : Joi.string(),
        new_password : Joi.string(),
        confirm_password : Joi.string().valid(Joi.ref('new_password')).messages({'any.only': 'Passwords does not match.'})

    }
).with( 'old_password', 'new_password').messages({'object.with': 'new_password is missing' })
 .with( 'old_password', 'confirm_password' ).messages({'object.with': 'confirm_password is missing'})
 .with( 'new_password', ['confirm_password', 'old_password'])
 .with( 'confirm_password', ['old_password', 'new_password']);

module.exports = {RegisterSchema, EmailVerifySchema, EmailResendSchema, MobileResendSchema, MobileVerifySchema, ProfileUpdateSchema}