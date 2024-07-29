const { Router } = require("express")
const { userIsLoggedIn } = require("../middlewares/auth.middleware")

const { UsersDAO } = require("../dao/mongo/users.dao")
const dao = new UsersDAO

const { UsersService } = require("../service/users-service")
const service = new UsersService(dao)

const { UsersController } = require("../controllers/users.controller")
const controller = new UsersController(service)

const {uploaderDocuments } = require("../middlewares/uploadFiles")

module.exports = () => {

    const router = Router()

    // Usuario premium
    router.get("/premium/:uid", userIsLoggedIn, async (req, res) => {

        await controller.changeRole(req, res)

    })


    // Reset Password 1 (nuevo, con jwt) - Se envia un mail para restablecer la contraseña
    router.get("/newResetPassword", async (req, res) => {
        await controller.sendEmailToResetPassword(req, res)
    })


    // Reset Password 2 (nuevo, con jwt) - El mail contiene un link para restablecer la contraseña. El link es un form "post" que manda los datos hacia aca
    router.post("/reset-password", async (req, res) => {
        await controller.newResetPassword(req, res)

    })


    // Carga de documentos
    router.post("/:uid/documents", uploaderDocuments.array("documents", 3), async (req, res) => {

        await controller.uploadDocuments(req, res)
    })

    return router
}