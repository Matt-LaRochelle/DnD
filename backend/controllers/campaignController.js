const Campaign = require('../models/campaignModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all campaigns client has access to (DM or Player)
const getCampaigns = async (req, res) => {
    const user_id = req.user._id
    try {
        // Get all campaigns where the user_id matches the dmID as well as all the campaigns where one of the playerIDs matches the user_id
        const campaigns = await Campaign.find({ $or: [{ dmID: user_id }, { playerIDs: user_id }] }).sort({ createdAt: -1 }).sort({createdAt: -1})
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


// DM creates a new campaign
const createCampaign = async (req, res) => {
    const {dmID, dmUsername, title, description, hidden} = req.body
    
    // Check that user filled out all information
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

    // Check valid ID
    if (!mongoose.Types.ObjectId.isValid(dmID)) {
        return res.status(404).json({error: 'Player does not exist.'})
    }

    // Add doc to db
    try {
        const campaign = await Campaign.create({title, dmID, dmUsername, description, hidden})
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their campaign
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


// Player joins an existing campaign
const joinCampaign = async (req, res) => {

    const { campaignID, playerID, playerUsername } = req.body
    let emptyFields = []
    if (!campaignID) {
        emptyFields.push('campaignID')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please enter campaign ID'})
    }


    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }
    if (!mongoose.Types.ObjectId.isValid(playerID)) {
        return res.status(404).json({error: 'No such user'})
    }

    // Check if the player is already in the campaign
    try {
        const campaign = await Campaign.findOne({
            _id: campaignID, 
            playerIDs: { $in: [playerID] }
        });
        if (campaign) {
            return res.status(400).json({ error: 'Player is already in the campaign' });
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }

    // Check if the player is the DM of the campaign - DM should not also be a player.
    try {
        const campaign = await Campaign.findOne({
            _id: campaignID, 
            dmID: playerID 
        });
        if (campaign) {
            return res.status(400).json({ error: 'DM cannot join as a player' });
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({error: err.message})
    }


    try {
        // Add the playerID and playerUsername to the campaign
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            campaignID,
            { 
                $push: { 
                    playerIDs: playerID,
                    playerUsernames: playerUsername,
                    playerSettings: {
                        id: playerID,
                        username: playerUsername,
                        settings: {
                            description: true,
                            image: true,
                            players: true,
                            maps: true,
                            playerCharacters: true,
                            nonPlayerCharacters: true,
                            creatures: true,
                            quests: true
                        }
                    
                    }
                }
            },
            { new: true }
        );

        res.status(200).json(updatedCampaign);
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
}


// Player leaves an existing campaign
const leaveCampaign = async (req, res) => {

    const { campaignID, playerID, playerUsername, playerSettings } = req.body


    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }
    if (!mongoose.Types.ObjectId.isValid(playerID)) {
        return res.status(404).json({error: 'No such user'})
    }

    console.log(playerID)

    try {
        // Delete the playerID and playerUsername from the campaign
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            campaignID,
            { 
                $pull: { 
                    playerIDs: playerID,
                    playerUsernames: playerUsername,
                    playerSettings: playerSettings
                }
            },
            { new: true }
        );

        res.status(200).json(updatedCampaign);
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
}
const userSettingsCampaign = async (req, res) => {
    const { campaignID, id, settings } = req.body

    console.log("userSettingsCampaign", campaignID, id, settings)
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'})
    }

    try {
        const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: campaignID, "playerSettings.id": id },
            { 
                $set: { 
                    "playerSettings.$.settings": settings
                }
            },
            { new: true }
        );

        if (!updatedCampaign) {
            return res.status(404).json({error: 'No matching user in campaign'})
        }

        res.status(200).json(updatedCampaign);
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
}















// update a campaign
const updateCampaign = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    const campaign = await Campaign.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

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
    joinCampaign,
    leaveCampaign,
    userSettingsCampaign,
    updateCampaign
}