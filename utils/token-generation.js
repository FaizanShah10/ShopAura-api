const jwt = require('jsonwebtoken')
require('dotenv').config()

const tokenGeneration = (user) => {
    const token = jet.sign({email: user.email, userid: user._id}, process.env.JWT_SECRET_TOKEN)
}


module.exports.tokenGeneration = tokenGeneration
