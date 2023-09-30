const Campaign = require('../models/campaignModel')
const mongoose = require('mongoose')

// get all campaigns
const getCampaigns = async (req, res) => {
    const user_id = req.user._id

    const campaigns = await Campaign.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(campaigns)
}


// get a single campaign
const getCampaign = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    const campaign = await Campaign.findById(id)

    if (!campaign) {
        return res.status(404).json({error: 'No such campaign'})
    }

    res.status(200).json(campaign)
}


// create new campaign
const createCampaign = async (req, res) => {
    const {dm, title, description, hidden} = req.body
    console.log(dm);

    let emptyFields = []

    if (!title) {
        emptyFields.push('title')
    }
    if (!dm) {
        emptyFields.push('dm')
    }
    if (!description) {
        emptyFields.push('description')
    }
    if (!hidden) {
        emptyFields.push('hidden')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    // add doc to db
    try {
        // const user_id = req.user._id

        const campaign = await Campaign.create({title, dm, description, hidden})
        res.status(200).json(campaign)
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log(error.message)
    }
}

// delete a campaign
const deleteCampaign = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    const campaign = await Campaign.findOneAndDelete({_id: id})

    if (!campaign) {
        return res.status(400).json({error: 'No such campaign'})
    }

    res.status(200).json(campaign)
}

// update a campaign
const updateCampaign = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    const campaign = await Campaign.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!campaign) {
        return res.status(400).json({error: 'No such campaign'})
    }

    res.status(200).json(campaign)
}


module.exports = {
    getCampaigns,
    getCampaign,
    createCampaign,
    deleteCampaign,
    updateCampaign
}