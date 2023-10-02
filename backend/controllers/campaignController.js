const Campaign = require('../models/campaignModel')
const User = require('../models/userModel')
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

    if (!mongoose.Types.ObjectId.isValid(dm)) {
        return res.status(404).json({error: 'Player does not exist.'})
    }

    // add doc to db
    try {

        // 1. Create the campaign
        const campaign = await Campaign.create({title, dm, description, hidden})

        // 2. Get campaign ID
        const campaignID = campaign._id.toString();
        // returns: 651b3819885bd325614e5215

        // 3. Create a new campaign object
        const newCampaign = {
            campaignID: campaignID,
            dm: true
        }

        // 4. Push newCampaign object to the user schema's campaigns list 
        const updatedUser = await User.findByIdAndUpdate(dm, { $push: { campaigns: newCampaign } }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

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