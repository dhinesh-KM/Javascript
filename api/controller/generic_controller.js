const create = (method) => {
    return async (req, res, next) => {
        const data = req.body
        try{
            
            const result = await method(data)
            const status = result.status
            delete result.status
            res.status(status).json(result)
        }
        catch(err){
            next(err)
        }
    }
}

const get = (method) => {
    return async(req,res,next) => {
        const params = req.params;
        try{
            
            const result = await method(params)
            const status = result.status
            delete result.status
            res.status(status).json(result)
        }
        catch(err){
            next(err)
        }
    }
}

const patch = (method) => {
    return async(req,res,next) => {
        const data = req.body;
        const params = req.params;
    
        try{
            const result = await method(params,data);
            const status = result.status;
            delete result.status;
            res.status(status).json(result);
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = {create, get, patch};