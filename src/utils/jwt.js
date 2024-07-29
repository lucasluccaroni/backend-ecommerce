const jwt = require("jsonwebtoken")
const { privateKey } = require("../config")

module.exports = {

    generatePasswordToken: (email) => {

        const token = jwt.sign({ email }, privateKey, { expiresIn: "5m" })
        return token
    },



    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    verifyPasswordToken: (req, res, next) => {

    }
}

