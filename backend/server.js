require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const campaignRoutes = require('./routes/campaigns')
const npcRoutes = require('./routes/npc')
const pcRoutes = require('./routes/pc')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user/', userRoutes)
app.use('/api/campaign/', campaignRoutes)
app.use('/api/npc/', npcRoutes)
app.use('/api/pc/', pcRoutes)


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

