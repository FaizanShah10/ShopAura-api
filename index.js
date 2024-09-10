const express = require('express')
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('dotenv').config()

//mongo connection
const db = require('./config/db')

//routes imports
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
    optionsSuccessStatus: 200,
    credentials: true 
  };


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors(corsOptions))






app.get('/', (req, res) => {
    res.send('Hello World!')
})

//routes
app.use("/api/user", userRoutes)
app.use('/api/product', productRoutes)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})