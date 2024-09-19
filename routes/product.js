const express = require('express');
const router = express.Router();

const productModel = require('../models/product');
const reviewModel = require('../models/reviews');
const { verifyAdmin, verifyLogin } = require('../middlewares/authentication');

// Create a new product
router.post('/new-product', verifyLogin, verifyAdmin, async (req, res) => {
    try {
        const { name, category, description, price, oldPrice, image, rating, colors, sizes, author } = req.body;

        // Create a new product instance
        const newProduct = new productModel({
            name,
            category,
            description,
            price,
            oldPrice,
            image,
            colors,
            sizes,
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

// Get all products
router.get('/all-products', async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get product by ID with reviews
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find reviews for the product
        const reviews = await reviewModel.find({ productId: id }).populate('userId', 'username email');
        
        // Return the product with reviews
        res.status(200).json({ product, reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the product', error: error.message });
    }
});

// Update product
router.put('/update-product/:id', verifyLogin, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Update the product with the given ID
        const updatedProduct = await productModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete a product
router.delete('/delete-product/:id', verifyLogin, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the product by ID
        const deletedProduct = await productModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted', deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
