const express = require('express')

// controller functions
const { signupUser, loginUser, forgotUser, verifyLink, resetPassword } = require('../controllers/userController')

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

module.exports = router