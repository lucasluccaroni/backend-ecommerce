const { logger } = require("../logger/logger")

class ProductsController {
    constructor(service) {
        this.service = service
    }

    async getProducts(req, res) {
        try {
            // Queries
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const sort = req.query.sort // asc o desc

            // Category y stock
            let query = {}
            if (req.query.category) {
                query.category = req.query.category

            } else if (req.query.stock) {
                query.stock = req.query.stock
            }

            const products = await this.service.getProducts(query, sort, limit, page)

            return products
        }
        catch (err) {
            req.logger.fatal(err)
            res.sendError(err.message)

        }

    }

    async getProductById(req, res) {
        try {
            const id = req.params.pid
            const product = await this.service.getProductById(id)
            console.log("REULTADO DE PRODUCT BY ID EN CONTROLLER => ", product)
            return product
        }
        catch (err) {
            req.logger.error("CATCH EN CONTROLLER - getProductById => ", err)
            res.json({ error: err })
        }
    }

    async addProduct(req, res) {
        try {
            const productData = req.body

            // Verifico que haya un mail de una sesion para asignar el owner. Si no, por defecto será 'admin'.
            const userEmail = req.user 
            ? req.user.email
            : "admin"

            const newProduct = await this.service.addProduct(productData, userEmail)
            req.logger.info("NEW PRODUCT CONTROLLER => ", newProduct)

            res.sendSuccess(newProduct)
        }
        catch (err) {
            req.logger.fatal("CATCH EN CONTROLLER - addProduct => ", err)
            res.status(err.code).send(err)
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid
            const productData = req.body

            const updatedProduct = await this.service.updateProduct(id, productData)

            res.sendSuccess("Product updated succesfully")
        }
        catch (err) {
            req.logger.fatal("CATCH EN CONTROLLER - updateProduct => ", err)
            req.logger.error(err.code)
            res.status(err.code).send(err)
        }
    }

    async deleteProduct(req, res) {
        try {
            const userEmail = req.session.user.email
            console.log("USER EMAIL DELETE => ", userEmail)
            const id = req.params.pid
            const deletedProduct = await this.service.deleteProduct(id, userEmail)

            res.sendSuccess(`Product succesfully deleted`)
        }
        catch (err) {
            // req.logger.error("CATCH EN CONTROLLER - deleteProduct => ", err)
            res.status(err.code).send(err)
        }
    }

    // Carga de imagenes para los products + guardarlos en la DB
    async uploadImages(req, res) {
        try{
            console.log(`ARCHIVO EN ${req.path}`)
            console.log(req.files)
    
            const files = req.files
            const productId = req.params.pid
            const uploadImages = await this.service.uploadImages(files, productId)

            res.sendSuccess("Image has been succesfully uploaded!")
        }
        catch(err){
            req.logger.fatal("CATCH EN CONTROLLER - uploadImages", err)
            req.logger.error(err.code)
            res.sendError(err.message)
        }
    }
}

module.exports = { ProductsController }