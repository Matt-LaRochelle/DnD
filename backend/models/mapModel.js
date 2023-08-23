const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mapSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    description: String,
    mapImage: String
}, { timestamps: true })

module.exports = mongoose.model('Map', mapSchema)