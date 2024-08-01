const UserModel = require("../models/user.model")
const { logger } = require("../../logger/logger")

class UsersDAO {

    async getUsers() {
        try {
            const users = await UserModel.find()
            return users?.map(u => u.toObject())
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUsers => ", err)
            return null
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id)
            return user?.toObject() ?? false
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUserById => ", err)
            return null
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email })
            return user?.toObject() ?? false
        }
        catch (err) {
            logger.error("Error en UsersDAO = getUserByEmail => ", err)
            return null
        }
    }

    async resetUserPassword(email, password) {
        try {
            const updatedUser = UserModel.updateOne({ email }, { $set: { password } })

            return updatedUser
        }
        catch (err) {
            logger.error("Error en UsersDAO = updateUser => ", err)
            return null
        }
    }

    async changeRole(id, userRole) {
        try {
            const result = await UserModel.findByIdAndUpdate({ _id: id }, { $set: { role: userRole } })
            return result

        }
        catch (err) {
            logger.error(`Error en ProductsDAO - changeRole => ${err}`)
            return null
        }
    }

    async uploadDocuments(userId, processedFiles) {
        try {

            const uploadDocuments = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $push: { documents: processedFiles } },
                { new: true }
            )

            console.log(uploadDocuments)

            return uploadDocuments
        }
        catch (err) {
            logger.error("Error en UsersDAO - uploadDocuments => ", err)
            return null
        }
    }

    // Actualizar la ultima conexion del user
    async updateLastConnection(userId, fechaHoraArg) {
        try {
            const lastConnection = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $set: { last_connection: fechaHoraArg } }
            )
            return lastConnection
        }
        catch (err) {
            logger.error("Error en UsersDAO - updateLastConnection => ", err)
            return null
        }
    }

    // Borrar usuarios antiguos
    async deleteOldUsers(today) {
        const deleteProcess = await UserModel.deleteMany({
            last_connection: { $lt: today }
        })
        return deleteProcess
    }

    // Borrar un usuario
    async deleteOneUser(userId) {
        try {
            const deleteOneUser = await UserModel.findByIdAndDelete(userId)
            return deleteOneUser
        }
        catch (err) {
            logger.error("Error en UsersDAO - deleteOneUser => ", err)
            return null
        }
    }
}

module.exports = { UsersDAO }