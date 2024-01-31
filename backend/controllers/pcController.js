const Pc = require('../models/pcModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all pcs in a campaign
const getPcs = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all pcs where the pc has a campaignID which matches current campaignID
        const pcs = await Pc.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(pcs)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}


// get a single pc
const getPc = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such pc'})
    }

    const pc = await Pc.findById(id)

    if (!pc) {
        return res.status(404).json({error: 'No such pc'})
    }

    res.status(200).json(pc)
}


// DM creates a new pc
const createPc = async (req, res) => {
    const {name, description, image, secrets, lastSeen, hidden, campaignID, userID} = req.body
    
    // Check that user filled out all information
    let emptyFields = []
    if (!name) {
        emptyFields.push('name')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all marked fields', emptyFields})
    }

    // Check that this User is the DM of the campaign

    
    // Check valid ID
    // if (!mongoose.Types.ObjectId.isValid(dmID)) {
    //     return res.status(404).json({error: 'Player does not exist.'})
    // }

    console.log(User.token)


    // Add doc to db
    try {
        const pc = await Pc.create({name, description, image, secrets, lastSeen, hidden, campaignID, userID})
        res.status(200).json(pc);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their pc
const deletePc = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such pc'})
    }

    const pc = await Pc.findOneAndDelete({_id: id})

    if (!pc) {
        return res.status(400).json({error: 'No such npc'})
    }

    res.status(200).json(pc)
}






// update a pc
const updatePc = async (req, res) => {
    console.log("req", req.body)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such pc'})
    }

    // How to make it return the new version?
    const pc = await Pc.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!pc) {
        return res.status(400).json({error: 'No such pc'})
    }

    res.status(200).json(pc)
}


module.exports = {
    getPcs,
    getPc,
    createPc,
    deletePc,
    updatePc
}