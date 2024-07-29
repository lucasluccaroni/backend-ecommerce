const { Router } = require("express")
const { userIsLoggedIn, userIsNotLoggedIn, userShouldBeAdminOrPremium } = require("../middlewares/auth.middleware")

const { UsersDAO } = require("../dao/mongo/users.dao")
const usersDAO = new UsersDAO()

module.exports = () => {

    const router = Router()


    // HOME
    router.get("/", (req, res) => {
        req.logger.info("Info de session en HOME => ", req.session.user)
        const isLoggedIn = ![null, undefined].includes(req.session.user)


        res.render("index", {
            title: "Home",
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        })
    })


    // REGISTER
    router.get("/register", userIsNotLoggedIn, (_, res) => {
        res.render("register", {
            title: "Register"
        })
    })

    // LOGIN
    router.get("/login", userIsNotLoggedIn, (_, res) => {

        res.render("login", {
            Title: "Login"
        })
    })

    //// RESET PASSWORD (viejo)
    //// router.get("/reset_password", userIsNotLoggedIn, (_, res) => {

    ////     res.render("reset_password", {
    ////         title: "Reset Passowrd"
    ////     })
    //// })

    // RESET PASSWORD 1 (nuevo, con jwt) - Se envia un mail para restablecer la contraseña
    router.get("/forgot-password", (_, res) => {
        res.render("forgot-password", {
            title: "SEND EMAIL - NEW RESET"
        })
    })

    // RESET PASSWORD 2 (nuevo, con jwt) - El mail contiene un link para restablecer la contraseña. Esta es la view de ese link
    router.get("/new-reset-password", (req, res) => {
        const { token } = req.query

        console.log("TOKEN QUE LLEGA DEL MAIL => ", token)
        res.render("new-reset-password", {
            title: "GET EMAIL - NEW RESET",
            token: token
        })
    })

    // PROFILE
    router.get("/profile", userIsLoggedIn, async (req, res) => {

        req.logger.info("Info de session en Profile: ", req.session)
        const idFromSession = req.session.user.id

        // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
        if (idFromSession == 1) {
            const user = req.session.user
            res.render("profile", {
                title: "My Profile",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                }
            })

            // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
        } else {
            const user = await usersDAO.getUserById(idFromSession)
            res.render("profile", {
                title: "My Profile",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    role: user.role
                }
            })
        }
    })

    // Vista de Carga de documentos para el USER
    router.get("/upload-documents", userIsLoggedIn, (req, res) => {

        const uid = req.session.user.id
        console.log("Informacion de sesion carga imagen =>", uid)

        res.render("uploadDocuments", {
            title: "Upload Documents",
            uid
        })
    })

    // Vista de Carga de imagenes de productos
    router.get("/upload-product-images/:pid", userIsLoggedIn, userShouldBeAdminOrPremium, (req, res) => {

        const pid = req.params.pid
        console.log("Informacion de products carga imagen =>", pid)

        res.render("uploadProductImages", {
            title: "Upload Product Images",
            pid
        })
    })

    return router
}