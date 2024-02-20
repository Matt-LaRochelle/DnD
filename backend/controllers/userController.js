const User = require('../models/userModel')
const Campaign = require('../models/campaignModel')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const mongoose = require('mongoose')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        // create a token
        const token = createToken(user._id)
        res.status(200).json({email, username: user.username, image: user.image, backgroundImage: user.backgroundImage, token, id: user._id})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {email, username, password, image} = req.body

    try {
        const user = await User.signup(email, username, password, image)
        // create a token
        const token = createToken(user._id)
        res.status(200).json({email, username, image, token, id: user._id})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// send reset password link to email
const forgotUser = async (req, res) => {
    const email = req.body.email

    try {
        const user = await User.forgot(email)

        // create a token
        const token = jwt.sign({ userID: user._id }, process.env.SECRET, { expiresIn: '1h' })
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
        await user.save();

        // create the email
        const message = {
            to: user.email,
            from: 'mattsdevprojects@gmail.com',
            subject: 'Password reset link',
            html: `<p>Click <a href="https://dnd-kukm.onrender.com/reset-password/${user.resetPasswordToken}">here</a> to reset your password.</p>`,
          };

        // send the email
        sgMail.send(message)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error('Email failed: ' + error);
        });
        res.status(200).json({message: "Email sent!"})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// verifies link from email
const verifyLink = async (req, res) => {
    const token = req.body.token;

    try {
        // Look up the user by token
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
       
        if (!user) {
            // If the token is invalid or has expired, render an error message or redirect to an error page
            return res.status(400).send('Invalid or expired password reset token');
        }

        // Render the password reset form with the token as a hidden input
        res.json({ token });
    } catch (err) {
        // Handle any errors that occur
        console.error(err);
        res.status(400).json({error: err.message})
    }
}

// reset the password
const resetPassword = async (req, res) => {
    const { token, password }= req.body

    try {
        // Look up the user by token
        const validUser = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!validUser) {
            // If the token is invalid or has expired, render an error message or redirect to an error page
            return res.status(400).send('Invalid or expired password reset token');
        }
        // Render the password reset form with the token as a hidden input
        const user = await User.reset(token, password)
        res.json({ user });
    } catch (err) {
        // Handle any errors that occur
        console.error(err);
        res.status(400).json({error: err.message})
    }
}

// AuthContext check for 3 day period
const checkCookies = async (req, res) => {
    res.status(200).json({message: "You're logged in!"})
} 

// Get single User object (full details including password) -- not used in this project yet.
const getUser = async (req, res) => {
    // Get the users ID
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'})
    }

    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}


// Get all Users which are in a specific campaign
const getUsers = async (req, res) => {
    // Create empty variable to store the campaign, returning users and dm
    let campaign;
    let userArray;
    let dm;
    // Get the campaign ID
    const campaignID = req.params.campaign
    console.log("Campaign ID", campaignID)
    try {
        campaign = await Campaign.findById(campaignID)
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
    console.log("campaign", campaign)
    // Get all users in the campaign
    try {
        const users = await User.find({ _id: { $in: campaign.playerIDs } })
        console.log("Users", users)
    // For each user, get the user.username, user.image
        userArray = users.map(user => {
            return {
                username: user.username,
                image: user.image,
                id: user._id
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
    // Get DM info in the campaign
    try {
        const dmInfo = await User.findById(campaign.dmID)
        dm = {
            username: dmInfo.username,
            image: dmInfo.image,
            id: dmInfo._id
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message)
    }
    // Return users array and dm
    res.status(200).json({users: userArray, dm})

}


// update a user
const updateUser = async (req, res) => {
    console.log("req", req.body)
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such user'})
    }

    // If the req.body is doing a password you have to salt and hash it...
    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true })

    if (!user) {
        return res.status(400).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

module.exports = { 
    loginUser, 
    signupUser, 
    forgotUser, 
    verifyLink, 
    resetPassword, 
    checkCookies, 
    getUser,
    getUsers, 
    updateUser }