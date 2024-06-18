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

const p_create = (method) => {
    return async (req, res, next) => {
        req.body.cofferid = req.user.coffer_id;
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
        const data = { cofferid: req.user.coffer_id }; 
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



const p_patch = (method) => {
    return async(req,res,next) => {
        req.body.cofferid = req.user.coffer_id;
        const data = req.body;
        const params = req.params;
        console.log(data,params)
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

const Delete = (method) => {
    return async(req,res,next) => {
        req.params.cofferid = req.user.coffer_id
        const data = req.params;

        try{
            const result = await method(data);
            const status = result.status;
            delete result.status;
            res.status(status).json(result);
        }
        catch(err){
            next(err);
        }
    }
}




module.exports = {p_create, create, get, patch, p_patch, Delete};