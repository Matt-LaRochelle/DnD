const mongoose = require('mongoose')

const Schema = mongoose.Schema

const questSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    type: {
        type: String,
    },
    givenBy: {
        type: String,
    },
    returnTo: {
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

module.exports = mongoose.model('Quest', questSchema)