const { Router } = require("express")
const { userShouldBeAdmin, userIsLoggedIn, userShouldBeAdminOrPremium } = require("../middlewares/auth.middleware")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const dao = new ProductsDAO()

const { ProductsService } = require("../service/products-service")
const service = new ProductsService(dao)

const { ProductsController } = require("../controllers/products.controller")
const controller = new ProductsController(service)

const { uploaderProducts } = require("../middlewares/uploadFiles")

module.exports = () => {

    const router = Router()

    // Todos los productos
    router.get("/", async (req, res) => {
        const products = await controller.getProducts(req, res)

        res.render("products", {
            title: "Products!",
            products
        })
    })

    // Traer un producto por su ID
    router.get("/:pid", userIsLoggedIn, async (req, res) => {
        req.logger.info("Info de session en PRODUCT BY ID: ", req.session)

        const product = await controller.getProductById(req, res)

        res.render("productId", {
            title: "Product By Id",
            product
        })
    })

    // Cargar un nuevo producto
    router.post("/", userIsLoggedIn, userShouldBeAdminOrPremium, (req, res) => {
        controller.addProduct(req, res)
    })

    // Actualizar un producto existente
    router.put("/:pid", userIsLoggedIn, userShouldBeAdmin, (req, res) => {
        req.logger.info("Info de session en UPDATE: ", req.session.user)

        controller.updateProduct(req, res)
    })

    // Borrar un producto
    router.delete("/:pid", userIsLoggedIn, userShouldBeAdminOrPremium, (req, res) => {
        controller.deleteProduct(req, res)
    })


    // Cargar imagenes de productos
    router.post("/:pid/images", userIsLoggedIn, userShouldBeAdminOrPremium, uploaderProducts.array("images", 2), async (req, res) => {

        await controller.uploadImages(req, res)
    })


    return router
}
