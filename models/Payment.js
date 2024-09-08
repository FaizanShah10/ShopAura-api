const mongoose = require('mongoose');
const addressModel = require("./Address"); 

const paymentSchema = new mongoose.Schema({
    cardNumber: { type: String, required: true }, // Ideally encrypted
    cardHolderName: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true }, // Ideally encrypted
    billingAddress: addressModel, // Nested billing address
    isDefault: { type: Boolean, default: false }
});

// Check if the model is already compiled to avoid the error
module.exports = mongoose.model('payment', paymentSchema);
