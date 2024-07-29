const { ProductsDTO } = require("./products.dto")

class CartsDTO {
    constructor(cart) {
        this.id = cart._id.toString()
        this.products = cart.products.map((product) => {
            return new ProductsDTO(product).inCartTransform(product.quantity)
        })
    }

    trasnformOneCart() {
        return {
            id: this.id,
            products: this.products,
        }
    }

    transformVariousCarts(carts) {
        carts.map(c => {
            const transformation = this.trasnformOneCart(c)
            return transformation
        })
    }
}

module.exports = { CartsDTO }
