const mocha = require("mocha")
const supertest = require("supertest")
const mongoose = require("mongoose")

// RECORDAR DUPLICAR CONSOLA. EN UNA ENCENDER LA APLICACIÓN - EN LA OTRA SE PRUEBAN LOS TESTS.

describe("TESTING SESSIONS", async () => {

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

    before(async () => {
        // Inicializacion e importacion de librerias.
        chai = await import("chai")
        expect = chai.expect
        requester = supertest("http://localhost:8080")
        const mongooseConnection = await mongoose.connect('mongodb://localhost:27017', { dbName: 'base-dev' });
        connection = mongooseConnection.connection
    })

    after(async () => {
        // Al final de la prueba borro la DB.
        await mongoose.connection.db.collection("users").deleteMany({})
        await mongoose.connection.close()
    })

    //- 1. register
    it("Register user, debe registrarse correctamente. Devuelve un 302", async () => {

        const registerUser = await requester.post("/api/sessions/register").send(mockUser)

        expect(registerUser.status).to.equal(302)

    })

    //- 2. Loging 
    //- 3. Enpoint Current
    it("Logging user, debe loggear correctamente + ir al endpoint current", async () => {

        const logging = await requester.post("/api/sessions/login")
            .send({
                email: mockUser.email,
                password: mockUser.password
            })

        expect(logging.status).to.equals(302)
        expect(logging.headers['set-cookie']).to.exist


        //2. Obtengo la info de sesion y la mando al current para devolver la info del usuario en el endpoint /current
        const cookieResult = logging.headers["set-cookie"][0]

        const currentEndpoint = await requester.get("/api/sessions/current")
            .set("Cookie", [cookieResult])

        expect(currentEndpoint.ok).to.be.true
        expect(currentEndpoint._body.email).to.be.equals(mockUser.email)
    })
}) 