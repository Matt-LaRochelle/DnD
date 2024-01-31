const express = require('express')
const {
    getPcs,
    getPc,
    createPc,
    deletePc,
    updatePc
} = require('../controllers/pcController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Pcs for a campaign
router.get('/:campaign/', getPcs)

// GET a single Pc
router.get('/:campaign/:id', getPc)

// POST a new Pc
router.post('/', createPc)

// DELETE a Pc
router.delete('/:id', deletePc)

// UPDATE a Pc
router.patch('/:id', updatePc)


module.exports = router