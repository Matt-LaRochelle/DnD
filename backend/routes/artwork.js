const express = require('express')
const {
    getArtworks,
    createArtwork,
    deleteArtwork,
    updateArtwork
} = require('../controllers/artworkController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Artworks for a campaign
router.get('/:campaign/', getArtworks)

// POST a new Artwork
router.post('/', createArtwork)

// DELETE a Artwork
router.delete('/:id', deleteArtwork)

// UPDATE a Artwork
router.patch('/:id', updateArtwork)


module.exports = router