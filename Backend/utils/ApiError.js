class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors= [], // array storing all the errors
        stack=""
    ){
        super(message)
        this.statusCode = statusCode // statusCode in left is provided by Error class and we are overriding it with our statusCode.
        this.data = null // data field is p rovided by Error class and we are amking it null because we are dealing with Api Error not Api response so if error then no data.
        this.message = message // message in left side is given by Error class which we have defined above but we need to override it with our own message which is on right side.
        this.success = false // success is a flag given by Error which we don't want to send because we are dealing with errors. So message will go but success flag will not go.
        this.errors = errors // errors in left side is given by Error class and we overriding it with our own errors declared above.

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError};