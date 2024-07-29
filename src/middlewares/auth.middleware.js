const { UsersDAO } = require("../dao/mongo/users.dao")
const { logger } = require("../logger/logger")

const usersDAO = new UsersDAO()

module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: "User should be logged in!" })
        }
        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        if (isLoggedIn) {
            return res.status(401).json({ error: "User should not be logged in!" })
        }
        next()
    },


    adminAuth: (req, res, next) => {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }
        // Si es admin, lo autentifica y redirige a profile
        if (req.body.email === adminData.email && req.body.password === adminData.password) {
            req.session.user = adminData
            logger.http("Bienvenido ADMIN")
            return res.redirect("/profile")
        }

        // Si no es admin, continua con la autenticación normal
        next()
    },

    userShouldNotBeAdmin(req, res, next) {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }

        // Me fijo si el usuario es admin
        logger.debug("INFO DE SESSION AUTH MIDDLEWARE, USER SHOULD NOT BE ADMIN => ", req.session)
        const sessionInfo = req.session.user
        logger.http("SESSION.USER DATA => ", sessionInfo)

        // Valido si es admin. Si es manda un error
        if (adminData.role === sessionInfo.role) {
            return res.status(401).json({ error: "User should not be admin!" })
        }

        next()
    },

    userShouldBeAdmin(req, res, next) {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }

        // Me fijo si el usuario es admin
        console.log("INFO DE SESSION AUTH MIDDLEWARE, USER SHOULD BE ADMIN => ", req.session)
        const sessionInfo = req.session.user
        console.log("SESSION.USER DATA => ", sessionInfo)

        // Valido si es admin. Si NO es manda un error
        if (adminData.role !== sessionInfo.role) {
            return res.status(401).json({ error: "User should be admin or premium!" })
        }

        next()
    },

    async userShouldBeAdminOrPremium(req, res, next) {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }

        // Me fijo que es el usuario: admin - premium - user
        console.log("INFO DE SESSION AUTH MIDDLEWARE, USER SHOULD BE ADMIN => ", req.session)
        const sessionInfo = req.session.user.email
        console.log("SESSION.USER EMAIL => ", sessionInfo)

        // Valido si es admin o premium. Si NO es manda un error
        switch (sessionInfo) {

            case adminData.email:
                break;

            default:
                const user = await usersDAO.getUserByEmail(sessionInfo)
                logger.info("USER EN SWITCH => ", user )

                if (user.role !== "premium") {
                    return res.status(403).json({ error: "User should be admin or premium!" })
                } else {
                    break;
                }
        }
        next()
    }
}


