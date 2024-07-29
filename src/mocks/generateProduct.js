const { fakerES } = require("@faker-js/faker")

const generateProduct = () => ({
    id: fakerES.database.mongodbObjectId(),
    title: fakerES.commerce.productName(),
    description: fakerES.commerce.productDescription(),
    price: fakerES.commerce.price(),
    thumbnail: fakerES.image.url(),
    code: fakerES.number.hex({max: 10000}),
    stock: fakerES.number.int({min: 1, max: 200}),
    status: true,
    category: fakerES.commerce.productAdjective()
})

module.exports = { generateProduct }