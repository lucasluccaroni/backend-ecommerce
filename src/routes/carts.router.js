const { Router } = require("express")
// let { userShouldNotBeAdmin, userIsLoggedIn } = require("../middlewares/auth.middleware")

const { CartsDAO } = require("../dao/mongo/carts.dao")
const dao = new CartsDAO()

const { CartsService } = require("../service/carts-service")
const service = new CartsService(dao)

const { CartsController } = require("../controllers/carts.controllers")
const { userShouldNotBeAdmin, userIsLoggedIn } = require("../middlewares/auth.middleware")
const controller = new CartsController(service)

module.exports = () => {

    const router = Router()

    router.get("/", userIsLoggedIn, (req, res) => {
        controller.getCarts(req, res)
    })

    router.get("/:cid", userIsLoggedIn, async (req, res) => {
        const cart = await controller.getCartById(req, res)

        res.render("cart", {
            title: "Cart",
            cart
        })
    })

    router.post("/", userIsLoggedIn, (req, res) => {
        controller.createCart(req, res)
    })

    router.post("/:cid/products/:pid", userIsLoggedIn, userShouldNotBeAdmin, (req, res) => {
        controller.addProductToExistingCart(req, res)
    })

    router.put("/:cid/products/:pid", userIsLoggedIn, userShouldNotBeAdmin, (req, res) => {
        controller.updateProductFromExistingCart(req, res)
    })

    router.delete("/:cid/products/:pid", userIsLoggedIn, (req, res) => {
        controller.deleteProductFromExistingCart(req, res)
    })

    router.delete("/:cid", userIsLoggedIn, (req, res) => {
        controller.clearCart(req, res)
    })

    router.delete("/delete/:cid", userIsLoggedIn, (req, res) => {
        controller.deleteCart(req, res)
    })

    router.post("/:cid/purchase", userIsLoggedIn, (req, res) => {
        controller.purchaseCart(req, res)
    })

    return router
}