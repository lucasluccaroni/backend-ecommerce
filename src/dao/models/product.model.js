const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const schema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: [
        {
            docName: { type: String },
            docReference: { type: String }
        }
    ],
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String
    }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model("Product", schema, "products")