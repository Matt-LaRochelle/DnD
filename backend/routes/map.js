const express = require('express')
const {
    getMaps,
    getMap,
    createMap,
    deleteMap,
    updateMap
} = require('../controllers/mapController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require authorization before going to routes
router.use(requireAuth)

// GET all Maps for a campaign
router.get('/:campaign/', getMaps)

// GET a single Map
router.get('/:campaign/:id', getMap)

// POST a new Map
router.post('/', createMap)

// DELETE a Map
router.delete('/:id', deleteMap)

// UPDATE a Map
router.patch('/:id', updateMap)


module.exports = router