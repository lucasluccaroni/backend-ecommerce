const multer = require("multer")

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../files/products`)
    },
    filename: function (req, file, cb) {
        const pid = req.params.pid
        const fileName = `${file.originalname}-${pid}`
        cb(null, fileName)
    }
})
const uploaderProducts = multer({ storage: productStorage })



const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../files/documents`)
    },
    filename: function (req, file, cb) {
        const uid = req.params.uid
        const fileName = `${file.originalname}-${uid}`
        cb(null, fileName)
    }
})

const uploaderDocuments = multer({ storage: documentStorage })

module.exports = { uploaderProducts, uploaderDocuments }
