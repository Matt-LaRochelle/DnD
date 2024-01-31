const Npc = require('../models/npcModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all npcs in a campaign
const getNpcs = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all npcs where the npc has a campaignID which matches current campaignID
        const npcs = await Npc.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(npcs)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}


// get a single npc
const getNpc = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such npc'})
    }

    const npc = await Npc.findById(id)

    if (!npc) {
        return res.status(404).json({error: 'No such npc'})
    }

    res.status(200).json(npc)
}


// DM creates a new npc
const createNpc = async (req, res) => {
    const {name, description, image, secrets, lastSeen, hidden, campaignID} = req.body
    
    // Check that user filled out all information
    let emptyFields = []
    if (!name) {
        emptyFields.push('name')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    // Check that this User is the DM of the campaign

    
    // Check valid ID
    // if (!mongoose.Types.ObjectId.isValid(dmID)) {
    //     return res.status(404).json({error: 'Player does not exist.'})
    // }

    console.log(User.token)


    // Add doc to db
    try {
        const npc = await Npc.create({name, description, image, secrets, lastSeen, hidden, campaignID})
        res.status(200).json(npc);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their npc
const deleteNpc = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such npc'})
    }

    const npc = await Npc.findOneAndDelete({_id: id})

    if (!npc) {
        return res.status(400).json({error: 'No such npc'})
    }

    res.status(200).json(npc)
}






// update a npc
const updateNpc = async (req, res) => {
    console.log("req", req.body)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such npc'})
    }

    // How to make it return the new version?
    const npc = await Npc.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!npc) {
        return res.status(400).json({error: 'No such npc'})
    }

    res.status(200).json(npc)
}


module.exports = {
    getNpcs,
    getNpc,
    createNpc,
    deleteNpc,
    updateNpc
}