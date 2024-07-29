const MongoStore = require("connect-mongo")
const session = require("express-session")
const defaultOptions = require("./defaultOptions")
const { dbName, mongoUri} = require("../config/index")



const storage = MongoStore.create({
    dbName,
    mongoUrl: mongoUri,
    ttl: 1000
})

module.exports = session({
    store: storage,
    ...defaultOptions
})