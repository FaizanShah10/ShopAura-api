const express = require('express')
const router = express.Router()
const reviewModel = require('../models/reviews')
const productModel = require('../models/product')

//post review
router.post('/post-review', async (req, res) => {
    const { comment, rating, userId, productId } = req.body;

    try {
        // Check for an existing review
        const existingReview = await reviewModel.findOne({ productId, userId });

        if (existingReview) {
            // Update existing review
            existingReview.comment = comment;
            existingReview.rating = rating;
            await existingReview.save();
            return res.status(200).json({ message: 'Review updated', review: existingReview });
        } else {
            // Create new review
            const newReview = new reviewModel({
                comment: comment,
                rating: rating,
                userId: userId,
                productId: productId
            });
            await newReview.save();
            return res.status(201).json({ message: 'Review posted', review: newReview });
        }
    } catch (error) {
        console.error('Error posting review:', error.message);
        return res.status(500).json({ message: 'Error posting review', error: error.message });
    }
});


//get reviews
router.get('/all-reviews', async (req, res) => {
    try {
        const reviews = await reviewModel.find()
        res.send(reviews)
    } catch (error) {
        console.log("Error getting reviews", error.message)
    }
})

//get reviews by userId
router.get('/reviews-by-user/:userId', async (req, res) => {
    const {id} = req.params.id
    try {
        const userReview = await reviewModel.find({userId: id})
        if(userReview.length === 0){
            res.send("No reviews")
        } else {
            res.send(userReview)
        }
    } catch (error) {
        console.log("Error getting user review", error.message)
    }
})

//get reviews for a product
router.get('/reviews-for-product/:productId', async (req, res) => {
    const {productId} = req.params

    try {
        const reviews = await reviewModel.find({productId}).populate('userId', 'fullName email')

        if(reviews.length === 0){
            res.send("No reviews found for this product")
        }

        return res.status(200).send(reviews)
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        return res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
})



module.exports = router