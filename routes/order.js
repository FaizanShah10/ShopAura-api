const express = require('express');
const router = express.Router();

const orderModel = require('../models/Order')

router.post('/place-order', async (req, res) => {
    try {
        const { cartItems, address, payment, userId } = req.body;
        
        
        // Calculate total amount
        let totalAmount = 0;
        const productInfo = cartItems.map(item => {
            totalAmount += item.price * item.quantity;
            return {
                name: item.name,
                description: item.description,
                price: item.price,
                quantity: item.quantity
            };
        });

        // Create new order
        const newOrder = new orderModel({
            userId,
            productInfo,
            address,
            payment,
            totalAmount
        });

        // Save order to database
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});



module.exports = router