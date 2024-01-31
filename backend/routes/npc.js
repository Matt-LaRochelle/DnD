const express = require('express')
const {
    getNpcs,
    getNpc,
    createNpc,
    deleteNpc,
    updateNpc
} = require('../controllers/npcController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Npcs for a campaign
router.get('/:campaign/', getNpcs)

// GET a single Npc
router.get('/:campaign/:id', getNpc)

// POST a new Npc
router.post('/', createNpc)

// DELETE a Npc
router.delete('/:id', deleteNpc)

// UPDATE a Npc
router.patch('/:id', updateNpc)


module.exports = router