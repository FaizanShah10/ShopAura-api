const express = require('express');
const router = express.Router();

const orderModel = require('../models/Order')


router.post('/place-order', async (req, res) => {
    const { userId, userName, productInfo, address, payment, totalAmount, orderStatus } = req.body;

    try {
        // Create a new order document
        const newOrder = new orderModel({
            userId,
            userName,
            productInfo,
            address,
            payment,
            totalAmount,
            orderStatus: orderStatus || 'pending', // Optional orderStatus or default to 'pending'
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Respond with success status and order details
        res.status(201).json({
            message: 'Order placed successfully',
            order: savedOrder,
        });

    } catch (error) {
        // Log and respond with error if something goes wrong
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
});


//fetch all orders
router.get('/all-orders', async (req, res) => {
    try {
        const response = await orderModel.find()
        res.send(response)
    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router