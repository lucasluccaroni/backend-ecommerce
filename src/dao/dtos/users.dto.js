class UsersDTO {
    constructor(user) {
        this.id = user._id.toString(),
            this.firstName = user.firstName,
            this.lastName = user.lastName,
            this.age = user.age,
            this.password = user.password,
            this.email = user.email,
            this.cart = user.cart,
            this.role = user.role,
            this.documents = user.documents,
            this.last_connection = user.last_connection
    }

    transform() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age,
            email: this.email,
            cart: this.cart,
            role: this.role,
            last_connection: this.last_connection,
            documents: this.documents
        }
    }
}

module.exports = { UsersDTO }