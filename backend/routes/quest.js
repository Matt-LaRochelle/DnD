const express = require('express')
const {
    getQuests,
    getQuest,
    createQuest,
    deleteQuest,
    updateQuest
} = require('../controllers/questController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Quests for a campaign
router.get('/:campaign/', getQuests)

// GET a single Quest
router.get('/:campaign/:id', getQuest)

// POST a new Quest
router.post('/', createQuest)

// DELETE a Quest
router.delete('/:id', deleteQuest)

// UPDATE a Quest
router.patch('/:id', updateQuest)


module.exports = router