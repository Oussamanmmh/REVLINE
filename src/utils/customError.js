class CustomError extends Error {
    constructor(errorObject){
        super(errorObject.message)
        this.name = this.constructor.name;
        this.status = errorObject.status || 400;
        this.details = errorObject.details || {};
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;