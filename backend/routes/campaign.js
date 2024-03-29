const express = require('express')
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    deleteCampaign,
    joinCampaign,
    leaveCampaign,
    userSettingsCampaign,
    updateCampaign
} = require('../controllers/campaignController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Campaigns
router.get('/', getCampaigns)

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

// UPDATE User settings for a campaign
router.patch('/settings', userSettingsCampaign)


//UPDATE a Campaign
router.patch('/:id', updateCampaign)


module.exports = router