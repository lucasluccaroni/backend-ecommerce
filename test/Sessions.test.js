const mocha = require("mocha")
const supertest = require("supertest")

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

    // Inicializacion e importacion de librerias.
    before(async () => {
        chai = await import("chai");
        expect = chai.expect;
        requester = supertest("http://localhost:8080");
    })

    //- 1. register
    it("Register user, debe registrarse correctamente. Devuelve un 302", async () => {

        const registerUser = await requester.post("/api/sessions/register").send(mockUser)

        expect(registerUser.status).to.equal(302)


    })

    //- 2. loging
    it("Logging user, debe loggear correctamente + current", async () => {

        const logging = await requester.post("/api/sessions/login")
            .send({
                email: mockUser.email,
                password: mockUser.password
            })

        expect(logging.status).to.equals(302)
        expect(logging.headers['set-cookie']).to.exist
        
        
        //2.  obtengo la info de sesion y la mando al current para devolver la info del usuario en el endpoint /current
        const cookieResult = logging.headers["set-cookie"][0]

        const currentEndpoint = await requester.get("/api/sessions/current")
            .set("Cookie", [cookieResult])
        
        console.log(currentEndpoint)
            expect(currentEndpoint.ok).to.be.true
            expect(currentEndpoint._body.email).to.be.equals(mockUser.email)



    })

}) 