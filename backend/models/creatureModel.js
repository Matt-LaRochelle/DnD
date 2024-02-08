const mongoose = require('mongoose')

const Schema = mongoose.Schema

const creatureSchema = new Schema({
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
    nativeTo: {
        type: String,
    },
    alignment: {
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

module.exports = mongoose.model('Creature', creatureSchema)