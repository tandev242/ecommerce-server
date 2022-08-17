const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant"
        },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });


module.exports = mongoose.model('Cart', cartSchema);