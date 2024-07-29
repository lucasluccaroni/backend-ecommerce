const passport = require("passport")
const { Strategy } = require("passport-github2")
const User = require("../dao/models/user.model")
const { clientID, callbackURL, clientSecret } = require("../config")
const { CartsDAO } = require("../dao/mongo/carts.dao")
const cartsDAO = new CartsDAO()
const { logger } = require("../logger/logger")

const initializeStrategy = () => {


    passport.use("github", new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            logger.info("Profile GITHUB => ", profile, "GITHUB JSON => ", profile._json)

            const user = await User.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }


            // Crear el usuario si no existe
            const fullName = profile._json.name
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '))
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1)
            logger.debug("FIRSTNAME:", firstName, "LASTNAME: ", lastName)

            const newCart = await cartsDAO.createCart()
            const newUser = {
                firstName,
                lastName,
                age: 30,
                email: profile._json.email,
                password: "",
                role: "user",
                cart: newCart.id
            }
            const result = await User.create(newUser)
            done(null, result)

        }
        catch (err) {
            done(err)
        }
    }))



    // SERIALIZER
    passport.serializeUser((user, done) => {
        console.log("serialized!", user)
        done(null, user._id)
    })

    // DESERIALIZER
    passport.deserializeUser(async (id, done) => {
        console.log("DEserialized!", id)
        const user = await User.findById(id)
        done(null, user)

    })
}

module.exports = initializeStrategy