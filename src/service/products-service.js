// Service - Repository
const { ProductsDTO } = require("../dao/dtos/products.dto")
const ProductModel = require("../dao/models/product.model")
const { CustomError } = require("./errors/CustomError")
const { ErrorCodes } = require("./errors/errorCodes")
const { generateInvalidProductIdError, generateInvalidProductDataError, generateWrongOwnerError } = require("./errors/errors")
const errors = require("./errors/errors")
const { logger } = require("../logger/logger")

class ProductsService {
    constructor(dao) {
        this.dao = dao
    }

    async getProducts(query, sort, limit, page) {

        let products = await this.dao.getProducts()
        if (!products) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        // Paginacion para enviar al controller
        products = await ProductModel.paginate(
            query,
            {
                sort: sort && { price: sort },
                limit,
                page,
                lean: true
            }
        )
        console.log("PRODUCTS DESPUES DE PAGINATE => ", products)

        // Transformacion de productos usando DTO
        let productsTransformed = await products.docs.map(p => {
            const dto = new ProductsDTO(p)
            const transformation = dto.transform()
            return transformation
        })
        // console.log("PRODUCTS DTO",productsTransformed)
        products.docs = productsTransformed
        // console.log("PRODUCTS PAGINATE => ", products)


        return products
    }

    async getProductById(id) {

        if (id.length < 24) {
            throw CustomError.createError({
                name: "Not Found <24",
                cause: "Product Not Found in Database",
                message: errors.generateInvalidProductIdError({ id }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const product = await this.dao.getProductById(id)
        // console.log("RESPUESTA PRODUCT DAO => ", product)

        if (product === false) {
            throw CustomError.createError({
                name: "Not Found false",
                cause: "Product not found in Database.",
                message: errors.generateInvalidProductIdError({ id }),
                code: ErrorCodes.NOT_FOUND
            })

        } else if (product === null) {
            throw CustomError.createError({
                name: "Invalid Data",
                cause: "Product not found in Database.",
                message: errors.generateInvalidProductIdError({ id }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Transformacion de producto usando DTO
        const dto = new ProductsDTO(product)
        const productTransformed = dto.transform()
        //console.log(productTransformed)
        return productTransformed
    }

    async addProduct(productData, userEmail) {

        const { title, description, code, price, status, stock, category } = productData

        if (!title || !code || price < 0 || !price || stock < 0 || !category || !description || !status) {
            throw CustomError.createError({
                name: "Invalid Data",
                cause: "Error trying to create a new Product. Try again.",
                message: errors.generateInvalidProductDataError(),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const newProduct = await this.dao.addProduct(productData, userEmail)
        if (!newProduct) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }
        return newProduct
    }

    async updateProduct(id, productData) {

        // Verificacion de que propiedades se quieren actualizar, y que estas sean parte de las propiedades del Product.Model
        let dataKeys = Object.keys(productData)
        // console.log("DATAKEYS =>", dataKeys)

        if (!dataKeys.includes("title") && !dataKeys.includes("description") && !dataKeys.includes("price") && !dataKeys.includes("stock") && !dataKeys.includes("status")) {
            throw CustomError.createError({
                name: "Invalid Data",
                cause: "Error trying to update a Product. Try again.",
                message: errors.generateInvalidProductDataError(),
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        const productToUpdate = await this.dao.getProductById(id)
        logger.info("PRODUCT FOUND SERVICE", productToUpdate)

        if (!productToUpdate) {
            throw CustomError.createError({
                name: "Not Found update",
                cause: "Product not found in Database.",
                message: generateInvalidProductIdError({ id }),
                code: ErrorCodes.NOT_FOUND
            })
        }

        const updatedProduct = await this.dao.updateProduct(id, productData)
        if (!updatedProduct) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: errors.databaseProblem(),
                code: ErrorCodes.DATABASE_ERROR
            })
        }

        return updatedProduct
    }

    async deleteProduct(id, userEmail) {

        const product = await this.getProductById(id)
        const productOwner = product.owner
        console.log("SERVICE - PRODUCT TO DELETE => ", productOwner)

        // Me fijo si el producto tiene como Owner al usuario que lo quiere eliminar. Solo puede eliminarlo la persona que lo creó Y EL ADMIN.
        if (userEmail !== product.owner) {
            if (userEmail === "admin@admin.com") {
                console.log("pase nomas, señor admin")
            } else {
                throw CustomError.createError({
                    name: "This Product is not yours!",
                    cause: "Wrong Owner",
                    message: generateWrongOwnerError(),
                    code: ErrorCodes.UNAUTHORIZED
                })

            }
        }
        const deletedProduct = await this.dao.deleteProduct(id)

        if (!deletedProduct) {
            throw CustomError.createError({
                name: "Database Error",
                cause: "Database problem caused failure in opreation",
                message: generateInvalidProductIdError({ id }),
                code: ErrorCodes.DATABASE_ERROR
            })

        } else if (deletedProduct.deletedCount == 0) {
            logger.info("DELETED PRODUCT SERVICE", deletedProduct.deletedCount)
            throw CustomError.createError({
                name: "Not Found",
                cause: "Product not found in Database.",
                message: generateInvalidProductIdError({ id }),
                code: ErrorCodes.NOT_FOUND
            })
        }

        logger.debug("DELETED PRODUCT SERVICE", deletedProduct.deletedCount)
        return (deletedProduct)
    }

    async uploadImages(files, productId) {

        // Busco al product por su id
        const product = await this.dao.getProductById(productId)
        if (!product) {
            throw CustomError.createError({
                name: "Not Found",
                cause: "Product not found in Database.",
                message: errors.generateInvalidProductIdError({ id }),
                code: ErrorCodes.NOT_FOUND
            })
        }

        // Extraigo el nombre y el path de el/los documento/s, que seran cargados al User en la DB
        const processedFiles = files.map((img) => {
            const { originalname, path } = img
            return { docName: originalname, docReference: path }
        })
        console.log(processedFiles)

        // Le cargo la imagen al user en la DB
        const uploadImages = this.dao.uploadImages(productId, processedFiles)

        return uploadImages
    }
}

module.exports = { ProductsService }