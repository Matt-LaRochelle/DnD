const mongoose = require('mongoose')

const Schema = mongoose.Schema

const campaignSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    maps: {
        type: String
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Campaign', campaignSchema)