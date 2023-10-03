const express = require('express')

// controller functions
const { 
    signupUser, 
    loginUser, 
    forgotUser, 
    verifyLink, 
    resetPassword, 
    getCampaigns,
    checkCookies } = require('../controllers/userController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// send password reset link route
router.post('/forgot', forgotUser)

// verify link from email route
router.post('/verify', verifyLink)

// reset password
router.post('/reset', resetPassword)


// require authorization before going to this route
router.use(requireAuth)

router.get('/check', checkCookies)

// get user's campaign list
router.get('/getCampaigns', getCampaigns)

module.exports = router