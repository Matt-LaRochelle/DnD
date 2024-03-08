const mongoose = require('mongoose')

const Schema = mongoose.Schema

const artworkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    campaignID: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Artwork', artworkSchema)