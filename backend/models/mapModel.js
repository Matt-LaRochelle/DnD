const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mapSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    secrets: {
        type: String,
    },
    hidden: {
        type: Boolean,
    },
    campaignID: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Map', mapSchema)