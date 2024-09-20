// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userName: {
        type: String,
    },
    productInfo: [{
        name: String,
        description: String,
        price: Number,
        quantity: Number,
    }],
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    payment: {
        cardNumber: { type: String, required: true },
        cardHolderName: { type: String, required: true },
        expirationDate: { type: String, required: true },
        cvv: { type: String, required: true },
        billingAddress: { type: String, required: true }
    },
    orderSatus:
    {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('order', orderSchema);

