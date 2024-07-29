const { ErrorCodes } = require("./errorCodes")

/**
 * @type {import("express").ErrorRequestHandler}
 */

const errorHandler = (error, req, res, next) => {
    // console.log("ERROR SWITCH ", error)
    // console.log("ERROR CAUSE SWITCH =>", error.cause)

    switch (error.code){
        case ErrorCodes.INVALID_TYPES_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(400).json({status: "Error", error: error.name, cause: error.cause, message: error.message})
            break
        
        case ErrorCodes.DATABASE_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(500).json({status: "Error", error: error.name, cause: error.cause, message: error.message})
            break
        
        case ErrorCodes.ROUTING_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(500).json({status: "Error", error: error.name, cause: error.cause, message: error.message})
            break

        case ErrorCodes.UNAUTHORIZED:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(401).json({status: "Error", error: error.name, cause: error.cause, message: error.message})
            break
        
        case ErrorCodes.NOT_FOUND:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(404).json({status: "Error", error: error.name, cause: error.cause, message: error.message})
            break
        
        default:
            console.log("ERROR CODE SWITCH default => ", error.code)
            res.status(500).json({status: "Error", error: "Unknown"})
            break
    }
    next() 
}

module.exports = { errorHandler }