const mongoose = require('mongoose')

const Schema = mongoose.Schema

const campaignSchema = new Schema({
    dmID: {
        type: String,
        required: true
    },
    dmUsername: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    playerIDs: [String],
    playerUsernames: [String],
    playerSettings: {
        type: Array
    },
    pcs: [String],
    npcs: [String],
    maps: [String],
    quests: [String],
    lore: [String],
    news: [String],
    diary: [String]
}, { timestamps: true })

module.exports = mongoose.model('Campaign', campaignSchema)