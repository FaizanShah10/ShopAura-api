const express = require('express');
const router = express.Router();

const userModel = require('../models/user')

router.post('/place-order', async (req, res) => {
    const {userId, address, payment} = req.body

    try {

        if(!address && !payment){
            return res.status(400).json({message: "Please provide address and payment details."})
        }
        //finding user
        const user = await userModel.findById(userId)
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        //adding address to user
        user.addresses.push(address)
    
        //adding payment to user
        user.paymentMethods.push(payment)
    
        await user.save()
    
        res.status(200).json({ message: 'Order placed successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
    }
})

module.exports = router