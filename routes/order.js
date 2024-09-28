const express = require('express');
const router = express.Router();

const orderModel = require('../models/Order')
const userModel = require('../models/user')


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

        //find user to save the payment, address info init
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }

        user.paymentMethods.push(payment);  //pushing the payment Info
        user.addresses.push(address); //pushing the address Info
        user.orders.push(productInfo) //pushing productInfo into orders

        await user.save()

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

//fetch orders by user id
router.get('/user-orders/:userId', async (req, res) => {

    const {userId} = req.params

    try {

        const order = await orderModel.find({userId})

        if(order.length === 0){
            return res.status(404).json({ message: 'No orders found for this user' })
        }


        res.json(order)

    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router