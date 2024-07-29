const { CartsDAO } = require("./mongo/carts.dao")
const {ProductsDAO } = require("./mongo/products.dao") 

module.exports = {
    Products: ProductsDAO,
    Carts: CartsDAO
}