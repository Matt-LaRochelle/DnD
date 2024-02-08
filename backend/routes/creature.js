const express = require('express')
const {
    getCreatures,
    getCreature,
    createCreature,
    deleteCreature,
    updateCreature
} = require('../controllers/creatureController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Creatures for a campaign
router.get('/:campaign/', getCreatures)

// GET a single Creature
router.get('/:campaign/:id', getCreature)

// POST a new Creature
router.post('/', createCreature)

// DELETE a Creature
router.delete('/:id', deleteCreature)

// UPDATE a Creature
router.patch('/:id', updateCreature)


module.exports = router