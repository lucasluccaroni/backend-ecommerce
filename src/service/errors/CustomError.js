class CustomError {
    static createError({
        name = "Error",
        cause,
        message,
        code = 1
    }) {
        const error = new Error()
        error.name = name
        error.cause = cause
        error.message = message
        error.code = code
        return error
    }
}

module.exports = { CustomError }