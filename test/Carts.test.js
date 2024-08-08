const mocha = require("mocha")
const supertest = require("supertest")
const mongoose = require("mongoose")
const { UsersDAO } = require("../src/dao/mongo/users.dao")
const ProductModel = require("../src/dao/models/product.model")

// RECORDAR DUPLICAR CONSOLA. EN UNA ENCENDER LA APLICACIÓN - EN LA OTRA SE PRUEBAN LOS TESTS.


describe("TESTING CARTS", async () => {

    // Genero los DAOs que necesito
    const usersDao = new UsersDAO()

    // Variables para guardar un ID de producto, un ID de cart y hacer los tests.
    let cartId
    let productId
    let userId

    // una variable "cookieResult" donde se insertará la cookie para los tests.
    let cookieResult

    // Variable que luego se usará para la conexion de mongo.
    let connection

    // User1 para testear
    const adminData = {
        firstName: "admin",
        lastName: "admin",
        age: 100,
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
        id: 1
    }

    // User2 para testear
    const mockUser = {
        firstName: "prueba2",
        lastName: "prueba2",
        age: 50,
        email: "prueba2@prueba.com",
        password: "prueba2",
    }

    // Product1 para testear
    const mockProduct = {
        title: "mockProduct",
        description: "mockProduct",
        price: 999,
        code: "fff999",
        stock: 999,
        status: true,
        category: "mockProduct",
        owner: "mockProduct"
    }

    before(async () => {
        // Inicializacion e importacion de librerias.
        chai = await import("chai")
        expect = chai.expect
        requester = supertest("http://localhost:8080")
        const mongooseConnection = await mongoose.connect('mongodb://localhost:27017', { dbName: 'base-dev' });
        connection = mongooseConnection.connection


        // Registro un user en la pagina
        const register = await requester.post("/api/sessions/register").send(mockUser)


        // Loggeo al user en la pagina.
        const logging = await requester.post("/api/sessions/login")
            .send({
                email: mockUser.email,
                password: mockUser.password
            })
        cookieResult = logging.headers["set-cookie"][0]

        // Extraigo del usuario creado su ID y su CartID
        const user = await usersDao.getUserByEmail(mockUser.email)
        userId = user._id.toString()
        cartId = user.cart.toString()
        console.log(cartId)

        // Voy a pasar el usuario a Premium para habilitar las funcionalidades de este Rol.
        // Este será el sujeto con el que se van a hacer las pruebas de carrito.
        await requester.get(`/users/premium/${userId}`)
            .set("Cookie", [cookieResult])


        // Voy a cargar un producto en la DB pra los tests.
        const addProduct = await requester.post("/api/products/")
            .set("Cookie", [cookieResult])
            .send(mockProduct)

        // Este id lo voy a usar para seguir haciendo los tests    
        productId = addProduct._body.payload._id
        await ProductModel.findByIdAndUpdate({ _id: productId }, { $set: { owner: "admin" } })

    })

    after(async () => {
        // Al final de la prueba completa borro la DB.
        await mongoose.connection.db.collection("carts").deleteMany({})
        await mongoose.connection.close()
    })


    //- 1. Crear un carrito nuevo
    it("createCart - Se debe crear un carrito nuevo vacio correctamente", async () => {

        const createCart = await requester.post("/api/carts/")
            .set("Cookie", [cookieResult])

        expect(createCart._body.status).to.equals("success")
        expect(createCart.statusCode).to.equals(200)
    })

    //- 2. Añadir un producto a un carrito existente
    it("AddProductToExistingCart - Debe poder agregarse correctamente un producto al carito.", async () => {

        const addProductToExistingCart = await requester.post(`/api/carts/${cartId}/products/${productId}`)
            .set("Cookie", [cookieResult])
            .send(
                { quantity: 2 }
            )

        console.log(addProductToExistingCart)
        expect(addProductToExistingCart.status).to.equal(200)
        expect(addProductToExistingCart._body.payload.matchedCount).to.equals(1)
        expect(addProductToExistingCart._body.payload.acknowledged).to.be.true
        expect(addProductToExistingCart._body.payload.modifiedCount).to.equals(1)
    })

    //-3 Limpiar el carrito
    it("clearCart - Debe poder limpiarse el carrito y quedar vacio nuevamente", async () => {

        const clearCart = await requester.delete(`/api/carts/${cartId}`)
            .set("Cookie", [cookieResult])

        expect(clearCart.status).to.equal(200)
        expect(clearCart._body.payload.acknowledged).to.be.true
        expect(clearCart._body.payload.modifiedCount).to.equals(1)
        expect(clearCart._body.payload.matchedCount).to.equals(1)
    })
}) 