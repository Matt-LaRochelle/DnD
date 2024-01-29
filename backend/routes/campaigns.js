const express = require('express')
const {
    getCampaigns,
    getPlayerCampaigns,
    getCampaign,
    createCampaign,
    deleteCampaign,
    joinCampaign,
    leaveCampaign,
    updateCampaign
} = require('../controllers/campaignController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Campaigns
router.get('/', getCampaigns)
router.get('/player', getPlayerCampaigns)

// GET a single Campaign
router.get('/:id', getCampaign)

// POST DM a new Campaign
router.post('/', createCampaign)

// DELETE a campaign you are DM for
router.delete('/:id', deleteCampaign)

// UPDATE Join a campaign
router.patch('/join', joinCampaign)

// UPDATE Leave a campaign
router.patch('/leave', leaveCampaign)



//UPDATE a Campaign
// router.patch('/:id', updateCampaign)


module.exports = router