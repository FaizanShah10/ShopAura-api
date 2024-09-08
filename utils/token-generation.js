const jwt = require('jsonwebtoken')
require('dotenv').config()

const tokenGeneration = (user) => {
    return jwt.sign({email: user.email, userid: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
}


module.exports.tokenGeneration = tokenGeneration
