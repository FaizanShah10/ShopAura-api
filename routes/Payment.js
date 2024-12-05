const express = require('express');
const router = express.Router();
const Stripe = require('stripe');


const stripe = Stripe('sk_test_51OvkHY00BKfqzn3t3UU6yXQeKRnTjdm6wNHwjrFNp9NR5Kg8YaF1ckJLKFCBEpS1YtiMHznVbzF8PoySkdmUndCc0072oGSydr');

router.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        if (!amount || !currency) {
            return res.status(400).send({ error: 'Amount and currency are required.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency,
        });
        console.log("Payment Intent: ", paymentIntent)

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});


module.exports = router;