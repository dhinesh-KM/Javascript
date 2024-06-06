const Joi = require("joi");
const schema = require('./schema')
const {CustomError} = require('../middleware/customerror')

function result(req,res,next,value,error)
{
    if (error)
        //console.log(error.message)
        throw new CustomError(error.message.replace(/"/g, ''), 400)
    req.body = value;
    next();

}

const validate_payload =  ( schema ) => {
    return (req, res, next) => {
        const {value,error} = schema.validate(req.body, {abortEarly : false});

        console.log("v:",value,"\ne:",error)
        return result(req,res,next,value,error);
    }
}

const types_validate =  (req, res, next) => {

    const {verify_type,token_type} = req.params
    let schemaToValidate;
 
    
    const validVerifyTypes = ["email","mobile"]
    const validTokenTypes = ["verify","resend"]

    if (!validVerifyTypes.includes(verify_type)) {
        return res.status(400).json({ 'error': true, 'msg': `Invalid verify type [${verify_type}]` });
    }

    if (!validTokenTypes.includes(token_type)) {
        return res.status(400).json({ 'error': true, 'msg': `Invalid token type [${token_type}]` });
    }

    
    if (verify_type == 'email')
        schemaToValidate =  token_type == 'resend' ? schema.EmailResendSchema : schema.EmailVerifySchema;
                
    else if(verify_type == 'mobile')
        schemaToValidate =  token_type == 'resend' ? schema.MobileResendSchema : schema.MobileVerifySchema;
            
    const {value , error} = schemaToValidate.validate(req.body)
    return result(req,res,next,value,error)

}

const verify_type_validate = (req, res, next) => {
    const {verify_type} = req.params;
    
    schemaToValidate = verify_type == "email" ?  schema.EmailVerifySchema : schema.MobileVerifySchema;

    const {value , error} = schemaToValidate.validate(req.body, {abortEarly : false})
    return result(req,res,next,value,error)

}



module.exports = {validate_payload, verify_type_validate, types_validate}

