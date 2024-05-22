const validate_payload =  ( schema ) => {
    return (req, res, next) => {
        const {value,error} = schema.validate(req.body, {abortEarly: false});
        //console.log("v:",value,"\ne:",error)
        if (error)
            return res.status(400).json({'error': true, 'msg': error.message.replace(/"/g, '')}) 
        req.body = value
        next();
    }
}


module.exports = {validate_payload}