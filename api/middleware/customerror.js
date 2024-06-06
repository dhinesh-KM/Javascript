class CustomError extends Error {
    constructor(message,s_code){
        super(message);
        this.error = true
        this.statusCode = s_code
        
    }
}

module.exports = {CustomError}