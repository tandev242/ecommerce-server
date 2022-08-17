const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    }
}, { timestamps: true }
)
module.exports = mongoose.model("Variant", variantSchema)