const jwt = require('jsonwebtoken')
const {secretkey} = require('../controller/usercontroller')


function authjwt(req,res,next) {
    const token = req.header('Authorization')

    if (!token){
        return res.status(401).json({'msg': 'Access denied'})
    }
    
    jwt.verify(token.split(" ")[1], secretkey, (err, decoded) => {
        if (err) {
            if (err.name == "JsonWebTokenError"){
                return res.status(400).json({'msg': 'Invalid token'})
            }
            return res.status(500).json({'msg': err.message})
        }

        req.user = decoded
        next(); 
      })
    
}

module.exports = {authjwt}