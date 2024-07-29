// Crear una clase que tome los valores de service y se los mande a controller, para que este los devuelva en el formato deseado.
// Un "constructor"(service), que será de donde vendra la info.

class ProductsDTO {
    constructor(product) {
        this.id = product._id.toString(),
        this.title = product.title,
        this.description = product.description,
        this.price = product.price,
        this.thumbnail = product.thumbnail,
        this.code = product.code,
        this.stock = product.stock,
        this.status = product.status,
        this.category = product.category,
        this.owner = product.owner
    }

    transform() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            thumbnail: this.thumbnail,
            stock: this.stock,
            category: this.category,
            owner: this.owner
        }
    }

    inCartTransform(quantity){
        return {
            id: this.id,
            quantity
        }
    }
}

module.exports = { ProductsDTO }