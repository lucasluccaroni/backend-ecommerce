const nodemailer = require("nodemailer")
const { userGmail, passGmail } = require("../../config")


module.exports = {
    transport: nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: userGmail,
            pass: passGmail
        }
    })
}