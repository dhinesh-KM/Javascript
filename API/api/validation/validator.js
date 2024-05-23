const Joi = require("joi");
const schema = require('./schema')

function result(req,res,next,value,error)
{
    if (error)
        return res.status(400).json({'error': true, 'msg': error.message.replace(/"/g, '')}) 
    req.body = value;
    next();

}

const validate_payload =  ( schema ) => {
    return (req, res, next) => {
        const {value,error} = schema.validate(req.body);

        //console.log("v:",value,"\ne:",error)
        return result(req,res,next,value,error);
    }
}

const validate_payload_url =  (req, res, next) => {
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
            
    const {value , error} = schemaToValidate.validate(req.body )
    return result(req,res,next,value,error)

    }

module.exports = {validate_payload, validate_payload_url}

