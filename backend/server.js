require('dotenv').config()

const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const campaignRoutes = require('./routes/campaign')
const npcRoutes = require('./routes/npc')
const pcRoutes = require('./routes/pc')
const mapRoutes = require('./routes/map')
const creatureRoutes = require('./routes/creature')
const questRoutes = require('./routes/quest')
const artworkRoutes = require('./routes/artwork')


// express app
const app = express()
app.use(cors());

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
app.use('/api/map/', mapRoutes)
app.use('/api/creature/', creatureRoutes)
app.use('/api/quest/', questRoutes)
app.use('/api/artwork/', artworkRoutes)


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

