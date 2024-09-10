const express = require('express')
const router = express.Router()

const productModel = require('../models/product')



// Create a new product
router.post('/new-product', async (req, res) => {
    try {
        const { name, category, description, price, oldPrice, image, color, rating, author } = req.body;

        // Create a new product instance
        const newProduct = new productModel({
            name,
            category,
            description,
            price,
            oldPrice,
            image,
            color,
            rating,
            author
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Respond with the saved product
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

//get all products
router.get('/all-products', async (req, res) => {
    const products = await productModel.find()
    res.send(products)
})

//get product by id
router.get('/:id', async (req, res) => {
    const id = req.params.id
    const product = await productModel.findById({_id: id})
    res.send(product)
})


module.exports = router