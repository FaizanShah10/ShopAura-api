const express = require('express')
const router = express.Router()

const productModel = require('../models/product');
const { verifyAdmin, verifyLogin } = require('../middlewares/authentication');



// Create a new product
router.post('/new-product' , verifyLogin, verifyAdmin, async (req, res) => {
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

//update product
router.put('/update-product/:id', verifyAdmin , async (req, res) => {
    try {
        const id = req.params.id
        const updateProduct = await productModel.findOneAndUpdate({_id: id}, {...req.body}, {new: true})

        if(!updateProduct){
            return res.status(404).json({message: 'Product not found'})
        }

        res.status(200).send(updateProduct)

    } catch (error) {
        res.status(500).json({ message: 'Error Updating product', error: error.message });
    }
})

//delete a product
router.delete('/delete-product/:id', verifyAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const deletedProduct = await productModel.findByIdAndDelete({_id: id})
        res.status(200).send("Product deleted",deletedProduct)
    } catch (error) {
        console.log("Error Deleting product", error.message)
    }
})


module.exports = router