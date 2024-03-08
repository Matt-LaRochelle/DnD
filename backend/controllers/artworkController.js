const Artwork = require('../models/artworkModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all artworks in a campaign
const getArtworks = async (req, res) => {
    const campaignID = req.params.campaign

    // Check that request is coming from a valid campaign
    if (!mongoose.Types.ObjectId.isValid(campaignID)) {
        return res.status(404).json({error: 'No such campaign'})
    }

    try {
        // Get all artworks where the artwork has a campaignID which matches current campaignID
        const artworks = await Artwork.find({ campaignID }).sort({createdAt: -1})
        res.status(200).json(artworks)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }   
}



// DM creates a new artwork
const createArtwork = async (req, res) => {
    const {
        url,
        description,
        campaignID
    } = req.body
    
    // Check that user filled out all information
    let emptyFields = []
    if (!url) {
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
        const artwork = await Artwork.create({
            url, 
            description, 
            campaignID
        })
        res.status(200).json(artwork);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};


// DM deletes their artwork
const deleteArtwork = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such artwork'})
    }

    const artwork = await Artwork.findOneAndDelete({_id: id})

    if (!artwork) {
        return res.status(400).json({error: 'No such artwork'})
    }

    res.status(200).json(artwork)
}






// update a artwork
const updateArtwork = async (req, res) => {
    console.log("req", req.body)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such artwork'})
    }

    // How to make it return the new version?
    const artwork = await Artwork.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!artwork) {
        return res.status(400).json({error: 'No such artwork'})
    }

    res.status(200).json(artwork)
}


module.exports = {
    getArtworks,
    createArtwork,
    deleteArtwork,
    updateArtwork
}