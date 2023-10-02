const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const campaignsSchema = new Schema({
    campaignID: {
        type: String,
        required: true
    },
    dm: {
        type: Boolean,
        required: true
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Number
    },
    campaigns: {
        type: [campaignsSchema]
    }
})

// static signup method
userSchema.statics.signup = async function (email, username, password) {
    
    // validation
    if (!email || !password || !username) {
        throw Error('All fields must be filled.')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.')
    }

    // Check if email is already in use
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use.')
    }

    // salt and hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // send user object to database
    const user = await this.create({ email, username, password: hash })

    // return user object to other files
    return user
}

// static login method
userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect email.')
    }

    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
        throw Error('Incorrect password.')
    }

    return user
    
}


// static forgot method
userSchema.statics.forgot = async function (email) {
    if (!email) {
        throw Error('Must include an email')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error ('Incorrect email')
    }
    return user
}

// static reset method
userSchema.statics.reset = async function (token, password) {
    if (!token || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const user = await this.findOne({ resetPasswordToken: token })

    if (!user) {
        throw Error ('Invalid token')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Update the user's password field
    user.password = hash

    // Save the updated user document to the database
    await user.save()

    return user
}

module.exports = mongoose.model('User', userSchema)