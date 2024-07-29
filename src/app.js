const express = require("express")
const mongoose = require("mongoose")
const { dbName, mongoUri, port } = require("./config")
const expressHandlebars = require("express-handlebars")
const passport = require("passport")
const { logger } = require("./logger/logger")


const { configureCustomResponses } = require("./controllers/utils")
const createProductsRouter = require("./routes/products.router")
const createCartsRouter = require("./routes/carts.router")
const createSessionsRouter = require("./routes/sessions.router")
const createViewsRouter = require("./routes/views.router")
const createMocksRouter = require("./routes/mocks.router")
const createLoggerRouter = require("./routes/loggerTest.router")
const createUsersRouter = require("./routes/users.router")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(configureCustomResponses)


const initializeStrategyLocal = require("./sessions-config/passport-local.config")
const initializeStrategyGitHub = require("./sessions-config/passport-github.config")
const sessionMiddleware = require("./session/mongoStorage")
const { useLogger } = require("./logger/logger")

app.use(sessionMiddleware)
initializeStrategyLocal()
initializeStrategyGitHub()

app.use(passport.initialize())
app.use(passport.session())

const swaggerJsDoc = require("swagger-jsdoc")
const { serve, setup  } = require("swagger-ui-express")
const _ = require("mongoose-paginate-v2")

const handlebars = expressHandlebars.create({
    defaultLayout: "main",
    handlebars: require("handlebars"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
})
app.engine("handlebars", handlebars.engine)
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

const dirname = `${__dirname}/../docs/**/*.yaml`
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Ecommece-backend",
            description: "App de ecommerce enfocada en su backend."
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions)
app.use("/apidocs", serve, setup(specs))

app.use(useLogger)

const main = async () => {

    await mongoose.connect(mongoUri, { dbName })

    const routers = [
        { path: "/api/sessions", createRouter: createSessionsRouter },
        { path: "/", createRouter: createViewsRouter },
        { path: "/api/products", createRouter: createProductsRouter },
        { path: "/api/carts", createRouter: createCartsRouter },
        { path: "/mockingproducts", createRouter: createMocksRouter },
        {path: "/loggerTest", createRouter: createLoggerRouter},
        {path: "/users", createRouter: createUsersRouter}
    ]

    for (const { path, createRouter } of routers) {
        app.use(path, await createRouter())
    }

    app.listen(port, () => {
        logger.info(`CoderServer Ready - port: ${port}`)
    })
}

main()
