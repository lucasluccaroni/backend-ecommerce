const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    products: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
})

module.exports = mongoose.model("Cart", schema, "carts")