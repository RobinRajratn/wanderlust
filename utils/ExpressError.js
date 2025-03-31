// // ExpressError is our custom error handling class which extends the default error handler of express
class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.status = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;