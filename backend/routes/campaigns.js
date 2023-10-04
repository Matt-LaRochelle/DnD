const express = require('express')
const {
    getDMCampaigns,
    getPlayerCampaigns,
    getCampaign,
    joinCampaign,
    createCampaign,
    deleteCampaign,
    updateCampaign
} = require('../controllers/campaignController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Campaigns
router.get('/dm', getDMCampaigns)
router.get('/player', getPlayerCampaigns)

//GET a single Campaign
router.get('/:id', getCampaign)

//POST (DM a new Campaign)
router.post('/', createCampaign)

//UPDATE (Join a campaign)
router.patch('/join/:userID', joinCampaign)

//DELETE a Campaign
router.delete('/:id', deleteCampaign)

//UPDATE a Campaign
// router.patch('/:id', updateCampaign)


module.exports = router