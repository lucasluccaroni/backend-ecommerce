const supertest = require("supertest")
const mocha = require("mocha")
const mongoose = require("mongoose")

// describe("Testing PRODUCTS router", async () => {

//     const productMock = {
//         title: "Product Test",
//         description: "Product Test",
//         price: 10000,
//         thumbnail: "Product Test",
//         code: "aaa111",
//         stock: 10000,
//         status: true,
//         category: "Product Test",
//         owner: "Product Test"
//     }

//     const adminData = {
//         firstName: "admin",
//         lastName: "admin",
//         age: 100,
//         email: "admin@admin.com",
//         password: "admin",
//         role: "admin",
//         id: 1
//     }

//     //- Inicializacion e importacion de librerias.
//     before(async () => {
//         chai = await import("chai");
//         expect = chai.expect;
//         requester = supertest("http://localhost:8080");
//     })
    
    
//     //- Prueba para ver si funciona el comando testing.
//     const suma = (a, b) => a + b

//     it("suma correcta", () => {

//         const expectedResult = 5
//         const result = suma(2, 3)

//         expect(result).to.equal(expectedResult)
//     })

//     //- GET todos los productos
//     // it.skip("GET /api/products => trae todos los productos", async () => {
        
//     //     const {statusCode, ok, body } = await requester.get("/api/priducts/")
//     //     expect(statusCode).to.equals(200)

//     // })

//     //- POST creando un producto
//     it("POST /api/products => debe crear un nuevo producto y guardarlo en la DB", async () => {

//         const logging = await requester.post("/login").send({
//             email: adminData.email,
//             password: adminData.password
//         })

//         const { statusCode, ok, body } = await requester.post("/api/products").send(productMock)

//         expect(ok).to.be.true
//         expect(statusCode).to.be.equal(200)

//     })
// })