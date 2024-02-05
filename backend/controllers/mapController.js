const Map = require('../models/mapModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all maps in a campaign
const getMaps = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all maps where the map has a campaignID which matches current campaignID
        const maps = await Map.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(maps)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}


// get a single map
const getMap = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such map'})
    }

    const map = await Map.findById(id)

    if (!map) {
        return res.status(404).json({error: 'No such map'})
    }

    res.status(200).json(map)
}


// DM creates a new map
const createMap = async (req, res) => {
    const {name, description, image, secrets, hidden, campaignID} = req.body
    
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


    // Add doc to db
    try {
        const map = await Map.create({name, description, image, secrets, hidden, campaignID})
        res.status(200).json(map);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their map
const deleteMap = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such map'})
    }

    const map = await Map.findOneAndDelete({_id: id})

    if (!map) {
        return res.status(400).json({error: 'No such map'})
    }

    res.status(200).json(map)
}






// update a map
const updateMap = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such map'})
    }

    // How to make it return the new version?
    const map = await Map.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!map) {
        return res.status(400).json({error: 'No such map'})
    }

    res.status(200).json(map)
}


module.exports = {
    getMaps,
    getMap,
    createMap,
    deleteMap,
    updateMap
}