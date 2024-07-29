const { Router } = require("express")
const { generateProduct } = require("../mocks/generateProduct")

module.exports = () => {
    const router = Router()

    router.get("/", (req, res) => {

        let products = []

        for (let i = 0; i <= 100; i++) {
            products.push(generateProduct())
        }
        
        res.json(products)
    })

    return router
}