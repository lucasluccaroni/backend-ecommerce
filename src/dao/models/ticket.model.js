const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime:{
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser:{
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model("Ticket", schema, "tickets")
