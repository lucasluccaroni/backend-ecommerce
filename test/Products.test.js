const mocha = require("mocha")
const supertest = require("supertest")
const mongoose = require("mongoose")
const { ProductsDAO } = require("../src/dao/mongo/products.dao")

// RECORDAR DUPLICAR CONSOLA. EN UNA ENCENDER LA APLICACIÓN - EN LA OTRA SE PRUEBAN LOS TESTS.


describe("TESTING PRODUCTS", async () => {

    // Genero un DAO
    const productsDAO = new ProductsDAO()

    // una variable para guardar el ID del producto y hacer los tests.
    let productId

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
    // Product1 para testear
    const mockProduct = {
        title: "mockProduct",
        description: "mockProduct",
        price: 999,
        code: "aaa111",
        stock: 999,
        status: true,
        category: "mockProduct",
        owner: "admin"
    }

    before(async () => {
        // Inicializacion e importacion de librerias.
        chai = await import("chai")
        expect = chai.expect
        requester = supertest("http://localhost:8080")
        const mongooseConnection = await mongoose.connect('mongodb://localhost:27017', { dbName: 'base-dev' });
        connection = mongooseConnection.connection


        // Tambien me voy a loggear un usuario para poder realizar las pruebas que requieren estar loggeado. Pasaré la cookie generada a cada prueba para que entienda que estoy loggeado a la app.
        const logging = await requester.post("/api/sessions/login")
            .send({
                email: adminData.email,
                password: adminData.password
            })
        cookieResult = logging.headers["set-cookie"][0]
    })

    after(async () => {
        // Al final de la prueba borro la DB.
        await mongoose.connection.db.collection("products").deleteMany({})
        await mongoose.connection.close()
    })


    //- 1. Cargar un producto a la DB
    it("addProduct - Debe cargar correctamente un nuevo producto en la DB", async () => {

        const addProduct = await requester.post("/api/products/")
            .set("Cookie", [cookieResult])
            .send(mockProduct)

        // Este id lo voy a usar para seguir haciendo los tests    
        productId = addProduct._body.payload._id

        expect(addProduct._body.payload.title).to.equals(mockProduct.title)
        expect(addProduct._body.status).to.equals("success")
    })

    //- 2. Get product by ID
    it("GetProductByID - Debe devolver un producto por su ID.", async () => {

        // Iremos al endpoint que devuelve un producto por su ID.    
        const getProductById = await requester.get(`/api/products/${productId}`)
            .set("Cookie", [cookieResult])
            .send()

        expect(getProductById.status).to.equal(200)
    })

    //-3 Debo poder actualizar el producto
    it("updateProduct - Debo poder modificar el campo 'title' del producto correctamente", async () => {

        const updateProduct = await requester.put(`/api/products/${productId}`)
            .set("Cookie", [cookieResult])
            .send({ title: "Titulo cambiado" })


        const updatedProductInDB = await productsDAO.getProductById(productId)

        expect(updateProduct.statusCode).to.equals(200)
        expect(updateProduct._body.payload).to.equals("Product updated succesfully")
        expect(updatedProductInDB.title).to.equals("Titulo cambiado")
    })
})