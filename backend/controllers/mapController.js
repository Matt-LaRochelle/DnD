const Map = require('../models/mapModel')
const mongoose = require('mongoose')

// get all maps
const getMaps = async (req, res) => {
    const user_id = req.user._id

    const maps = await Map.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(maps)
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


// create new map
const createMap = async (req, res) => {
    const {title, description, mapImage} = req.body

    let emptyFields = []

    if (!title) {
        emptyFields.push('title')
    }
    if(emptyFields.length > 0) {
        // In this case, it is only necessary to have a title, other fields
        // can be filled in later or never depending on the game
        return res.status(400).json({ error: 'Map must have a title', emptyFields})
    }

    // add doc to db
    try {
        const user_id = req.user._id

        const map = await Map.create({title, user_id})
        res.status(200).json(map)
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log(error.message)
    }
}

// delete a map
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

    const map = await Map.findOneAndUpdate({_id: id}, {
        ...req.body
    })

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