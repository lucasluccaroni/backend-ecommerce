const { ErrorCodes } = require("../service/errors/errorCodes")
const { CustomError } = require("../service/errors/CustomError")
const errors = require("../service/errors/errors")
const { logger } = require("../logger/logger")

class UsersController {
    constructor(service) {
        this.service = service
    }

    //// async resetPassword(req, res) {
    ////     try {
    ////         const { email, password } = req.body

    ////         const resetPassword = this.service.resetPassword(email, password)

    ////         return resetPassword
    ////     }
    ////     catch (err) {
    ////         // console.log("CATCH EN CONTROLLER - resetPassword", err)
    ////         res.status(err.code).json(err)
    ////     }
    //// }

    // Traer usuario por ID
    async getUserById(req, res) {
        try {
            const idFromSession = req.session.user.id
            logger.debug("ID SESSION CONTROLLER => ", idFromSession)

            if (idFromSession == 1) {
                const user = req.session.user
                res.send(user)

            } else {
                const user = await this.service.getUserById(idFromSession)
                res.send(user)
            }
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - resetPassword", err)
            res.sendError(err.message)
        }
    }

    // Cambiar rol de user -> premium (y visceversa)
    async changeRole(req, res) {
        try {
            const userId = req.params.uid
            logger.info("USER ID - USERS CONTROLLER => ", userId)

            const changeRole = await this.service.changeRole(userId)
            res.sendSuccess(`User role modified! => ${changeRole} `)
        }
        catch (err) {
            req.logger.fatal("CATCH EN CONTROLLER - changeRole", err)
            req.logger.error(err.code)
            res.status(err.code).send(err)
        }
    }

    // Manda el email para que el usuario restablezca la contraseña
    async sendEmailToResetPassword(req, res) {
        try {
            const { email } = req.query
            logger.debug("EMAIL EN USERS CONTROLLER => ", email)

            await this.service.sendResetEmail(email)
            res.send("Recovery email sent. Check your inbox.")
        }
        catch (err) {
            console.log("ERR.MESSAGE => ", err.message)
            req.logger.fatal("CATCH EN CONTROLLER - newResetPassword", err)
            req.logger.error(err.code)
            res.sendError(err.message)
        }
    }

    // Restablecimiento de contraseña con JWT
    async newResetPassword(req, res) {
        const { password, token } = req.body

        logger.info("TOKEN => ", token)
        logger.info("PASSWORD => ", password)

        if (!token || !password) {
            throw CustomError.createError({
                name: "Invalid Credentials",
                cause: "Missing or Wrong credentials.",
                message: errors.generateInvalidCredentialsError(email, password),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        try {
            const resetPassword = await this.service.newResetPassword(token, password)
            res.sendSuccess(resetPassword)
        }
        catch (err) {
            req.logger.fatal("CATCH EN CONTROLLER - newResetPassword", err)
            req.logger.error(err.code)
            res.sendError(err.message)
        }
    }

    // Carga de documentos para los users + guardarlos en la DB
    async uploadDocuments(req, res) {
        try{
            console.log(`ARCHIVO EN ${req.path}`)
            console.log(req.files)
    
            const files = req.files
            const userId = req.session.user.id
            const uploadDocuments = await this.service.uploadDocuments(files, userId)

            res.sendSuccess("Image has been succesfully uploaded!")
        }
        catch(err){
            req.logger.fatal("CATCH EN CONTROLLER - uploadDocuments", err)
            req.logger.error(err.code)
            res.sendError(err.message)
        }
    }
    
    // Actualizar la fecha de última conexion en la DB
    async updateLastConnection(req, res) {
        const userId = req.user.id
        try{
            const updateLastConnection =  await this.service.updateLastConnection(userId)
            console.log(updateLastConnection)
        }
        catch(err) {
            req.logger.fatal("CATCH EN CONTROLLER - uploadDocuments", err)
            req.logger.error(err.code)
            res.sendError(err.message)
        }
    }
}

module.exports = { UsersController }