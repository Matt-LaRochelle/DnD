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

// GET all Npcs
router.get('/:campaign/', getNpcs)

// Haven't done this yet
// GET a single Npc
router.get('/:campaign/:id', getNpc)

// POST a new Npc
router.post('/', createNpc)

// Haven't done this yet
// DELETE a Npc
router.delete('/:id', deleteNpc)

// Haven't done this yet
// UPDATE a Npc
router.patch('/:id', updateNpc)


module.exports = router