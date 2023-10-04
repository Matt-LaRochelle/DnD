const Campaign = require('../models/campaignModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all campaigns you DM in
const getDMCampaigns = async (req, res) => {
    const user_id = req.user._id
    try {
        const campaigns = await Campaign.find({ dmID: user_id }).sort({createdAt: -1})
        res.status(200).json(campaigns)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}

// get all campaigns you are a Player in
const getPlayerCampaigns = async (req, res) => {
    const user_id = req.user._id
    try {
        const campaigns = await Campaign.find({ playerIDs: user_id }).sort({createdAt: -1})
        res.status(200).json(campaigns)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
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


// DM (Create) a new campaign
const createCampaign = async (req, res) => {
    const {dmID, dmUsername, title, description, hidden} = req.body
    console.log("dmID:", dmID);
    console.log("dmUsername:", dmUsername);
    console.log("title:", title);
    console.log("description:", description);
    console.log("hidden:", hidden);

    let emptyFields = []

    if (!title) {
        emptyFields.push('title')
    }
    if (!description) {
        emptyFields.push('description')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    if (!mongoose.Types.ObjectId.isValid(dmID)) {
        return res.status(404).json({error: 'Player does not exist.'})
    }

    try {
        const campaign = await Campaign.create({title, dmID, dmUsername, description, hidden})
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// Join a campaign
const joinCampaign = async (req, res) => {

    const { campaignID } = req.body
    const { userID } = req.params


    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(404).json({error: 'No such user'})
    }

    console.log(userID);

    try {
        // Add your user mongoID to the campaign players list
        const updatedCampaign = await Campaign.findByIdAndUpdate(campaignID, { $push: { players: userID } }, { new: true });

        res.status(200).json(updatedCampaign);
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }

}













// delete a campaign you DM
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
    getDMCampaigns,
    getPlayerCampaigns,
    getCampaign,
    createCampaign,
    joinCampaign,
    deleteCampaign,
    updateCampaign
}