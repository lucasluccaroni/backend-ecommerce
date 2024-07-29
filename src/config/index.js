const { config } = require("dotenv")

config()

// Base de datos dev o prod
const dbName = process.env.NODE_ENV === "prod" ? "coderhouse-backend-capas" : "base-dev"
process.env.DB_NAME = dbName
console.log(` DTABASE NAME => ${process.env.DB_NAME}`)

module.exports = {
    mongoUri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
    port: process.env.PORT,
    appId: process.env.APPID_GITHUB,
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: process.env.CALLBACK_URL_GITHUB,
    enviroment: process.env.NODE_ENV,
    userGmail: process.env.GMAIL_ACCOUNT,
    passGmail: process.env.GMAIL_PASS,
    privateKey: process.env.PRIVATE_KEY
}