const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userModel = require('../models/user')
const {tokenGeneration} = require('../utils/token-generation')

router.get('/', (req, res) => {
    res.send('Hello from user Page')
})

//register
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNo, email, birthday, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new userModel({ fullName, phoneNo, email, birthday, password: hashedPassword });

    // Save user to the database
    await newUser.save();

    // Create a JWT token
    const token = tokenGeneration(newUser)

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Cookie expires in 1 hour

    // Respond with success and user data
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


//login
router.post('/login', async (req, res) => {
    const { emailOrPhone, password } = req.body;
  
    try {
      // Check if the input is an email or phone number
      let user;
      if (/\S+@\S+\.\S+/.test(emailOrPhone)) {
        // It's an email
        user = await userModel.findOne({ email: emailOrPhone });
      } else {
        // It's a phone number
        user = await userModel.findOne({ phoneNo: emailOrPhone });
      }
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
  
      // Generate JWT token and set it as a cookie
      const token = tokenGeneration(user)
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // set to true in production
        maxAge: 3600000 // 1 hour
      });
  
      res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

//logout
router.post('/logout', (req, res) => {
  // Clear the session or remove the token here
  res.clearCookie('token'); // Example for clearing a cookie-based token
  res.status(200).json({ message: 'Logged out successfully' });
});


//all users
router.get('/all-users', async (req, res) => {
    try {
        const response = await userModel.find()
    res.send(response)
    } catch (error) {
        console.log(error.message)
    }
})

//get user by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const response = await userModel.findById({_id: id})
        res.send(response)
    } catch (error) {
        console.log(error.message)
    }
})

//delete a user by id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const response = await userModel.findByIdAndDelete(id)
        res.status(200).send("user deleted");
    } catch (error) {
        console.log(error.message)
    }
})

//update user role by id
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id
        const role = req.body
        const user = await userModel.findByIdAndUpdate(id, {role}, {new: true})
        if(!user) {
            return res.status(404).send("user not found");
        }

        res.send(user)

    } catch (error) {
        console.log(error.message)
    }
})

//update/edit user profile
router.put("/update-profile/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { fullName, email, password, phoneNo } = req.body;
    
        const user = await userModel.findById(id)
        if(!user){
            res.status(400).send("No user found")
        }

        user.fullName = fullName
        user.email = email
        user.phoneNo = phoneNo

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }


        await user.save()
        res.status(200).send({message: "profile updated"})


    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router