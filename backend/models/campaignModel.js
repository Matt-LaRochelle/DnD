const mongoose = require('mongoose')

const Schema = mongoose.Schema

const campaignSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    description: String,
    maps: [String],
    npcs: [String],
    pcs: [String],
    quests: [String],
    news: [String],
    lore: [String],
    treasure: [String],
    items: [String],
    creatures: [String],
}, { timestamps: true })

module.exports = mongoose.model('Campaign', campaignSchema)