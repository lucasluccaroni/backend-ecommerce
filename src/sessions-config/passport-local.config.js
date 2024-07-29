const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("../dao/models/user.model")
const hashingUtils = require("../utils/hashing")

const { CartsDAO } = require("../dao/mongo/carts.dao")
const cartsDAO = new CartsDAO()

const { logger } = require("../logger/logger")

const initializeStrategy = () => {

    // REGISTER
    passport.use("register", new Strategy({
        passReqToCallback: true,
        usernameField: "email",

    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email, } = req.body

        try {
            const user = await User.findOne({ email: username })
            if (user) {
                // error, usuario con es mail ya existe
                // No hubo un error a nivel aplicacion, solo que el email ya esta usado y la ejecucion del register terminaría aca
                return done(null, false)
            }

            // Se le crea un carrito vacio
            const newCart = await cartsDAO.createCart()
            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: hashingUtils.hashPassword(password),
                cart: newCart.id
            }

            const result = await User.create(newUser)

            // usuario nuevo creado exitosamente
            return done(null, result)

        }
        catch (err) {
            logger.fatal(err)
            done("Error al obtener el usuario ", err)
        }
    }))



    //LOGIN
    passport.use("login", new Strategy({
        usernameField: "email",

    }, async (username, password, done) => {

        try {

            if (!username || !password) {
                return done(null, false)
            }


            // 1. Verificar que el usuario exista en la BD - HECHO
            const user = await User.findOne({ email: username })

            if (!user) {
                return done(null, false)
            }

            //2. Validar password
            if (!hashingUtils.isValidPassword(password, user.password)) {
                return done(null, false)
            }


            // exito, se devuelve el user.
            return done(null, user)

        }
        catch (err) {
            done(err)
        }
    }))


    // SERIALIZER
    passport.serializeUser((user, done) => {
        logger.debug("serialized!", user)
        done(null, user._id)
    })

    // DESERIALIZER
    passport.deserializeUser(async (id, done) => {
        logger.http("DEserialized!", id)
        const user = await User.findById(id)
        done(null, user)

    })
}

module.exports = initializeStrategy