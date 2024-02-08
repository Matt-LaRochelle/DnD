const Creature = require('../models/creatureModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all Creatures in a campaign
const getCreatures = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all Creatures where the Creature has a campaignID which matches current campaignID
        const creatures = await Creature.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(creatures)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}


// get a single creature
const getCreature = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such creature'})
    }

    const creature = await Creature.findById(id)

    if (!creature) {
        return res.status(404).json({error: 'No such creature'})
    }

    res.status(200).json(creature)
}


// DM creates a new creature
const createCreature = async (req, res) => {
    const {
        name, 
        description, 
        image, 
        nativeTo, 
        alignment, 
        secrets, 
        hidden, 
        campaignID
    } = req.body
    
    // Check that user filled out all information
    let emptyFields = []
    if (!name) {
        emptyFields.push('name')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({ 
            error: 'Please fill in all marked fields', 
            emptyFields
        })
    }

    // Check that this User is the DM of the campaign

    
    // Check valid ID
    // if (!mongoose.Types.ObjectId.isValid(dmID)) {
    //     return res.status(404).json({error: 'Player does not exist.'})
    // }


    // Add doc to db
    try {
        const creature = await Creature.create({
            name, 
            description, 
            image, 
            nativeTo, 
            alignment, 
            secrets, 
            hidden, 
            campaignID
        })
        res.status(200).json(creature);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their creature
const deleteCreature = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such creature'})
    }

    const creature = await Creature.findOneAndDelete({_id: id})

    if (!creature) {
        return res.status(400).json({error: 'No such creature'})
    }

    res.status(200).json(creature)
}






// update a creature
const updateCreature = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such creature'})
    }

    // How to make it return the new version?
    const creature = await Creature.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!creature) {
        return res.status(400).json({error: 'No such creature'})
    }

    res.status(200).json(creature)
}


module.exports = {
    getCreatures,
    getCreature,
    createCreature,
    deleteCreature,
    updateCreature
}