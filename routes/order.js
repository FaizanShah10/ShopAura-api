const express = require('express');
const router = express.Router();
require('dotenv').config()


const orderModel = require('../models/Order')
const userModel = require('../models/user');
const { verifyLogin } = require('../middlewares/authentication');
const { verifyAdmin } = require('../middlewares/authentication');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




router.post('/create', async (req, res) => {
    const { userId, userName, productInfo, address, payment, totalAmount } = req.body;

    console.log("Product Info: ", productInfo);

    if (!userId || !productInfo || !address || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const lineItems = productInfo.map((product) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: product.name,
                description: product.description,
            },
            unit_amount: parseInt(product.price) * 100,
        },
        quantity: product.quantity,
    }));

    try {
        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success', 
            cancel_url: 'http://localhost:5173/cancel',   
        });

        // Return the sessionId to the frontend
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});




//fetch all orders
router.get('/all-orders', verifyLogin, verifyAdmin, async (req, res) => {
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