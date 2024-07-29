const { Router } = require("express")
const passport = require("passport")
const { userIsLoggedIn, adminAuth } = require("../middlewares/auth.middleware")

const { UsersDAO } = require("../dao/mongo/users.dao")
const dao = new UsersDAO()

const { UsersService } = require("../service/users-service")
const service = new UsersService(dao)

const { UsersController } = require("../controllers/users.controller")
const controller = new UsersController(service)


module.exports = () => {

    const router = Router()

    router.get("/current", userIsLoggedIn, async (req, res) => {

        console.log(req.user.documents.length)
        const idFromSession = req.session.user.id
        // req.logger.info("Info de session en Current: ", req.session.user)
        // req.logger.info("ID SESSION => ", idFromSession)

        // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
        if (idFromSession == 1) {
            const user = req.session.user
            res.send(user)

            // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
        } else {
            controller.getUserById(req, res)
        }
    })

    // REGISTER FORM
    router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
        req.logger.info("Usuario => ", req.user)
        res.redirect("/")
    })

    // REGISTER FAIL
    router.get("/failregister", (_, res) => {
        res.send("Error registering user!")
    })

    // LOGIN FORM
    router.post("/login", adminAuth, passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
        req.logger.info("INFO PARA LOGIN => ", req.body)
        req.session.user = { email: req.user.email, id: req.user.id }
        
        const updateLastConnection = await controller.updateLastConnection(req, res)
        res.redirect("/")
    })

    // LOGIN FAIL
    router.get("/faillogin", (_, res) => {
        res.render("faillogin")
    })

    // LOGIN CON GITHUB
    router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => { })

    router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/api/sessions/fallogin" }), async (req, res) => {

        req.session.user = { email: req.user.email, id: req.user.id }

        const updateLastConnection = await controller.updateLastConnection(req, res)

        res.redirect("/profile")
    })

    // LOGOUT
    router.get("/logout", async (req, res) => {

        const updateLastConnection = await controller.updateLastConnection(req, res)

        req.session.destroy(_ => {
            res.redirect("/")
        })
    })

    // RESET PASSWORD (viejo)
    //// router.post("/reset_password", async (req, res) => {
    ////     const resetPassword = await controller.resetPassword(req, res)
    ////     req.logger.info(resetPassword)

    ////     res.redirect("/")
    //// })

    // RESET PASSWORD (nuevo con JWT)
    router.post("/forgot-password", async (req, res) => {
        const newResetPassword = await controller.newResetPassword(req, res)
        console.log(newResetPassword)
        // res.render("forgot-password", {
        // })
    })

    return router
}

