require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const campaignRoutes = require('./routes/campaigns')
const mapRoutes = require('./routes/maps')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/campaigns/', campaignRoutes)
app.use('/api/maps', mapRoutes)


// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB and listening on port 4000.')
        })
    })
    .catch((error) => {
        console.log(error)
    })

