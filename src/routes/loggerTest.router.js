const { Router } = require("express")

module.exports = () => {
    const router = Router()

    router.get("/", (req, res) => {

        req.logger.fatal("mensaje de prueba Logger nivel FATAL!")
        req.logger.error("Mensaje de prueba Logger nivel ERROR!")
        req.logger.warning("Mensaje de prueba Logger nivel WARNING!")
        req.logger.info("Mensaje de prueba Logger nivel INFO!")
        req.logger.http("mensaje de prueba Logger nivel HTTP!")
        req.logger.debug("mensaje de prueba Logger nivel DEBUG!")

        res.send({ message: "Prueba de logger!" })

    })

    return router
}

