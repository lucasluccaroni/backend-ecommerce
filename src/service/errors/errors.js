module.exports = {

    // DATABASE
    databaseProblem() {
        return "An unexpected error caused failure in opreation. Please try again later and verify your inputs."
    },

    // PRODUCTS
    generateInvalidProductIdError(id) {
        return ` Invalid product data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    },

    generateInvalidProductDataError() {
        return ` Some product data sent is incorrect or missing. Please check it before re-sending.`
    },

    generateWrongOwnerError() {
        return `This product does not belong to you and you're not admin!`

    },

    generateSameOwnerError() {
        return `This product belongs to you! You can't add your own products to your cart.`

    },

    // CARTS
    generateInvalidCartIdError(id) {
        return ` Invalid cart data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    },

    generateInvalidCartDataError() {
        return ` Some cart data sent is incorrect or missing. Please check it before re-sending.`
    },

    generateWrongCartError(cartId) {
        return `Cart ${cartId} does not belong to this user!. Select your cart please.`
    },

    generateWrongQuantityError(quantity) {
        return `Recieved ${quantity} quantity. It must be less than product's stock.`
    },

    // USERS
    generateInvalidCredentialsError(email, password) {
        return ` Some user data sent is incorrect or missing. Please check it before re-sending. Recieved: ${email} and ${password}`
    },

    generateInvalidUserEmailError(email) {
        return ` Invalid user data. ID: Should be an MongoObjectId. Recived: ${email} (${typeof email})`
    },

    generateInvalidUserIdError(id) {
        return ` Invalid user data. ID: Should be an MongoObjectId. Recived: ${id} (${typeof id})`
    },

    generateSamePasswordError() {
        return "You can't set the same password as new password! Try another one."
    },

    generateInsufficientDocumentsError() {
        return "You must upload your 'ID PROOF', 'PROOF OF ADRESS' AND 'PROOF OF ACCOUNT STATEMENT' to be able to change your role! "
    },

    generateWrongFileNamesError() {
        return "Your files must be named: 'identification' or 'address' or 'statement'. Please check your file names and try again."
    }

}