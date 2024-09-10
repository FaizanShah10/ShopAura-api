require('dotenv').config()
const jwt = require('jsonwebtoken');
const userModel = require('../models/user')

// Middleware to check if user is logged in
const verifyLogin = async (req, res, next) => {
    try {
        // Log cookies to check if token is present
        //console.log('Cookies:', req.cookies);

        // Get the token from cookies
        const token = req.cookies.token;

        // If token is not found
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //console.log('Decoded ID:',decoded.userid) //debugging check
        
        // Find the user by Id
        req.user = await userModel.findById(decoded.userid);
        //console.log('User', req.user) //debugging check
        
        // If user not found
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};


// Middleware to check if user is an admin
const verifyAdmin = (req, res, next) => {
    // Ensure user is logged in
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, not an admin' });
    }
    
    next();
};

module.exports = {
    verifyLogin,
    verifyAdmin
};
