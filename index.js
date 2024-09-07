const express = require('express')
const app = express()
require('dotenv').config()

//mongo connection
const db = require('./config/db')





app.get('/', (req, res) => {
    res.send('Hello World!')
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})