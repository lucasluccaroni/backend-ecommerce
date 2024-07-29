const ProductModel = require("../models/product.model")
const { logger } = require("../../logger/logger")
const productModel = require("../models/product.model")

class ProductsDAO {


    async getProducts() {
        // try {
        const products = await ProductModel.find()
        return products.map(p => p.toObject())
        // }
        // catch (err) {
        //     console.log("Error en ProductsDAO - getProducts => ", err)
        //     return null
        // }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id)
            return product?.toObject() ?? false
        }
        catch (err) {
            // console.log("Error en ProductsDAO - getProductById => ", err)
            return null
        }
        // const product = await ProductModel.findById(id)
        // console.log("PRODUCT => ", product)

        // if (product) {
        //     const productObject = product.toObject()
        //     // console.log("PRODUCT TO OBJECT => ", productObject)


        //     if (productObject !== null && productObject !== undefined) {
        //     // console.log("PRODUCT TO OBJECT => ", productObject)

        //         return productObject

        //     } else {
        //         // console.log("false")
        //         return false
        //     }
        // } else {
        //     // console.log("Error en ProductsDAO - getProductById => Producto no encontrado")
        //     return null
        // }
    }

    async addProduct(product, email) {
        
        try {
            
            const newProduct = {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                status: product.status,
                category: product.category,
                owner: email
            }
            const productToAdd = await ProductModel.create(newProduct)
            return productToAdd.toObject()
        }
        catch (err) {
            logger.error("Error en ProductsDAO - addProduct => ", err)
            return null
        }
    }

    async updateProduct(id, product) {
        try {
            const result = await ProductModel.findByIdAndUpdate({ _id: id }, { $set: product })
            return result
        }
        catch (err) {
            logger.error("Error en ProductsDAO - updateProduct => ", err)
            return null
        }
    }

    async deleteProduct(id) {
        try {
            const result = await ProductModel.deleteOne({ _id: id })
            return result
        }
        catch (err) {
            logger.error("Error en ProductsDAO - deleteProduct => ", err)
            return null
        }
    }

    async uploadImages(productId, processedFiles) {
        try {

            const uploadImages = await ProductModel.findOneAndUpdate(
                { _id: productId },
                { $push: { thumbnail: processedFiles } },
                { new: true }
            )

            console.log(uploadImages)

            return uploadImages
        }
        catch (err) {
            logger.error("Error en UsersDAO - uploadImages => ", err)
            return null
        }
    }
}

module.exports = { ProductsDAO }