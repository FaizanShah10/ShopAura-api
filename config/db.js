const {mongoose } = require('mongoose')

require('dotenv').config()

mongoose.connect( `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@shopaura.xw9aj.mongodb.net/shopAura?retryWrites=true&w=majority&appName=shopAura`).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log(error.message)
})

module.exports = mongoose.connection