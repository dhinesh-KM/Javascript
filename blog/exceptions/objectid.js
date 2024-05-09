const mongoose = require('mongoose');

function isValidObjectId(req,res,next) {
    
    if (! mongoose.Types.ObjectId.isValid(req.params.id)){

        return res.status(400).json({'msg': `Invalid object id -"${req.params.id}" ` })
    }
    next()
}

module.exports = {isValidObjectId}