const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userModel = require('../models/user')
const tokenGeneration = require('../utils/token-generation')

router.get('/', (req, res) => {
    res.send('Hello from user Page')
})

//register
router.post('/register', async (req, res) => {
    try {
        const {fullName, email, password} = req.body

        //checking if user already exists with the same email
        const user = await userModel.findOne({email: email})
        if(user) res.status(401).send("email already registered")

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating/registering new user

        const newUser = await userModel.create({
            fullName, 
            email,
            password: hashedPassword
        })

        // JWT token creation and sending as a cookie
        const token = generateToken(newUser); 
        res.cookie("token", token);
        res.send("user registered");
    } catch (error) {
        console.log(error.message)
    }
})

//login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({email: email})
        if(!user) res.status(401).send("Invalid email or password")

        //password matching
        bcrypt.compare(password, user.password, function(err, result) {
            const token = tokenGeneration(user)
            res.cookie("token", token)
            res.send('user logged In')
        });

    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router