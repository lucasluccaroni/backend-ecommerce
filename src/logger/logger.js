const winston = require("winston")
const { customLevelOptions } = require("./customLevels.js")
const { enviroment } = require("../config")

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors, all: true }),
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors, all: true }),
                winston.format.timestamp(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: "error",
            filename: `${__dirname}/../../logs/errors.log`,
        }),
    ]
})

const logger = enviroment === "prod" ? prodLogger : devLogger

/**
 * @type {import('express').RequestHandler}
 */
const useLogger = (req, res, next) => {
    req.logger = logger

    next()
}


module.exports = { useLogger, logger}