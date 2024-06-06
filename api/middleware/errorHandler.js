const ErrorHandler = (err,req,res,next) => {
    //console.log("ooooooooooo",err.stack)
    res.status(err.statusCode || 500).json({'error': err.error, 'msg': err.message})
}

module.exports =  {ErrorHandler}