const { logger } = require("../logger/logger")

class CartsController {
    constructor(service) {
        this.service = service
    }

    async getCarts(_, res) {
        try {
            const result = await this.service.getCarts()
            res.sendSuccess(result)
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async getCartById(req, res) {
        try {
            const id = req.params.cid
            const cart = await this.service.getCartById(id)

            logger.info("CART => ", cart)
            return cart
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async createCart(_, res) {
        try {
            const newCart = await this.service.createCart()
            res.sendSuccess(newCart)
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async addProductToExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body
            const userInfo = req.session.user

            const result = await this.service.addProductToExistingCart(cartId, productId, quantity, userInfo)

            res.render("add-product-success", {
                title: "success"
            })
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async updateProductFromExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body
            const userInfo = req.session.user

            const result = await this.service.updateProductFromExistingCart(cartId, productId, quantity, userInfo)

            res.render("update-product-success", {
                title: "success",
                cartId
            })
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }

    }

    async deleteProductFromExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid

            const result = await this.service.deleteProductFromExistingCart(cartId, productId)

            res.render("delete-product-success", {
                title: "success",
                cartId
            })
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async clearCart(req, res) {
        try {
            const cartId = req.params.cid
            const result = await this.service.clearCart(cartId)
            res.sendSuccess(result)
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = req.params.cid
            const result = await this.service.deleteCart(cartId)
            res.sendSuccess(result)
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }

    async purchaseCart(req, res) {
        try {
            const userInfo = req.session.user
            const cartId = req.params.cid
            const ticket = await this.service.purchaseCart(cartId, userInfo)

            res.render("purchase", {
                title: "Success!",
                ticket,
                styles: [
                    "purchase.css"
                ]
            })
        }
        catch (err) {
            logger.fatal(err.message)
            res.status(err.code).send(err)
        }
    }
}

module.exports = { CartsController }