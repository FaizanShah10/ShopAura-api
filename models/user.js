const mongoose = require('mongoose');
const { addressSchema } = require('./Address');
const { paymentSchema } = require('./Payment');
const { orderSchema } = require('./Order')

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    addresses: { type: [addressSchema], default: [] },
    paymentMethods: { type: [paymentSchema], default: [] },
    orders: { type: [orderSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

// Check if the model is already compiled to avoid the error
module.exports = mongoose.model('user', userSchema);
