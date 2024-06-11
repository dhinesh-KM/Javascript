const Joi = require("joi");
const schema = require('./schema')
const {CustomError} = require('../middleware/customerror')

function result(req,res,next,value,error)
{
    if (error)
        //console.log( error.message)
        throw new CustomError(error.message.replace(/"/g, ''), 400)
    req.body = value;
    next();

}

const validate_payload =  ( schema ) => {
    return (req, res, next) => {
        const {value,error} = schema.validate(req.body, {abortEarly : false,  stripUnknown: true });

        //console.log("v:",value,"\ne:",error)
        return result(req,res,next,value,error);
    }
}

function verify_type_check(verify_type,token_type)
{
    const validVerifyTypes = ["email","mobile"]
    const validTokenTypes = ["verify","resend"]

    if (!validVerifyTypes.includes(verify_type)) 
        throw new CustomError(`Invalid verify type [${verify_type}] in the URL`, 400)


    if (!validTokenTypes.includes(token_type)) 
        throw new CustomError(`Invalid token type [${token_type}] in the URl`, 400)


}

const types_validate =  (req, res, next) => {

    const {verify_type,token_type} = req.params;
    let schemaToValidate;
    
    verify_type_check(verify_type,token_type);
    
    if (verify_type == 'email')
        schemaToValidate =  token_type == 'resend' ? schema.EmailResendSchema : schema.EmailVerifySchema;
                
    else if(verify_type == 'mobile')
        schemaToValidate =  token_type == 'resend' ? schema.MobileResendSchema : schema.MobileVerifySchema;
            
    const {value , error} = schemaToValidate.validate(req.body, { stripUnknown: true })
    return result(req,res,next,value,error)

}

const forget_validator = (req, res, next) => {
    const {verify_type} = req.params;
    let schemaToValidate =  verify_type == 'email' ? schema.EmailResendSchema : schema.MobileResendSchema;
    const {value , error} = schemaToValidate.validate(req.body, { stripUnknown: true })
    return result(req,res,next,value,error)
}

const forget_check_validator = (req, res, next) => {
    const {verify_type,token_type} = req.params;
    let schemaToValidate;
    verify_type_check(verify_type,token_type);
    schemaToValidate =  token_type == 'resend' ? schema.PasswordResendSchema : schema.passwordverifySchema;
    const {value , error} = schemaToValidate.validate(req.body, { stripUnknown: true })
    return result(req,res,next,value,error)
}


module.exports = {validate_payload, types_validate, forget_validator, forget_check_validator}

