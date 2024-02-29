const Quest = require('../models/questModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all quests in a campaign
const getQuests = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all quests where the quest has a campaignID which matches current campaignID
        const quests = await Quest.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(quests)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}


// get a single quest
const getQuest = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such quest'})
    }

    const quest = await Quest.findById(id)

    if (!quest) {
        return res.status(404).json({error: 'No such quest'})
    }

    res.status(200).json(quest)
}


// DM creates a new quest
const createQuest = async (req, res) => {
    const {
        title, 
        description, 
        image, 
        type, 
        user,
        givenBy, 
        returnTo, 
        hidden, 
        campaignID
    } = req.body
    
    // Check that user filled out all information
    let emptyFields = []
    if (!title) {
        emptyFields.push('title')
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
        const quest = await Quest.create({
            title, 
            description, 
            image, 
            type, 
            user,
            givenBy, 
            returnTo, 
            hidden, 
            complete: false,
            campaignID
        })
        res.status(200).json(quest);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their quest
const deleteQuest = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such quest'})
    }

    const quest = await Quest.findOneAndDelete({_id: id})

    if (!quest) {
        return res.status(400).json({error: 'No such quest'})
    }

    res.status(200).json(quest)
}






// update a quest
const updateQuest = async (req, res) => {
    console.log("req", req.body)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such quest'})
    }

    // How to make it return the new version?
    const quest = await Quest.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!quest) {
        return res.status(400).json({error: 'No such quest'})
    }

    res.status(200).json(quest)
}


module.exports = {
    getQuests,
    getQuest,
    createQuest,
    deleteQuest,
    updateQuest
}