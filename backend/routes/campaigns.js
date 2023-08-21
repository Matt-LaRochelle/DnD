const express = require('express')
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    deleteCampaign,
    updateCampaign
} = require('../controllers/campaignController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Campaigns
router.get('/', getCampaigns)

//GET a single Campaign
router.get('/:id', getCampaign)

//POST a new Campaign
router.post('/', createCampaign)

//DELETE a Campaign
router.delete('/:id', deleteCampaign)

//UPDATE a Campaign
router.patch('/:id', updateCampaign)


module.exports = router