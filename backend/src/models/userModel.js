import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import validator from "validator"

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: ['Buyer', 'Agent'],
    },

    password: {
        type: String,
        required: true
    },
    hasTrial: {
        type: Boolean,
        required: true
    },
    directoryId: {
        type: String
    },
    //Added an OTP field in the user schema
    otp: {
        code: String,
        expires: Date
    },

    favorites: {
        type: [Schema.Types.ObjectId],
        ref: "Listing"
    },

    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Subscription"
    }

    // TODO: add sharedGalleryIds if needed
}, { timestamps: true })

// static functions

/**
 * Validates credentials and, if valid, creates a user on the database
 * @param {String} email the email the create the user with
 * @param {String} password the password for the user
 * @throws validation error if the input is invalid (e.g. weak password)
 * @throws already exists error if the given email belongs to an existing user
 * @returns the created user
 */
userSchema.statics.registerUser = async function (email, password, name, userType) {
    // validate input
    validateCredentials(email, password, name)
    // Check if email already exists
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('A user with this e-mail already exists') // TODO: localize
    }
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    // create user on database
    const user = await this.create({
        name,
        email,
        password: hash,
        userType,
        hasTrial: true,
        favorites: []
        // TODO: add directory ID in file management task
    })

    return user
}

// Static method to authenticate a user when logging in
userSchema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Invalid email or password'); // Email not found
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Invalid email or password'); // Password does not match
    }
    return user;
}

/**
 * Checks whether the given email is of valid format and the password is strong enough
 * @param {String} email the email to be checked
 * @param {String} password the password to be checked
 */
const validateCredentials = (email, password, name) => {
    if (!email || !password || !name) {
        throw Error('Please fill in required fields') // TODO: localize
    }
    if (!validator.isEmail(email)) {
        throw Error('Please enter a valid e-mail')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('This password is not strong enough')
    }
}

export default mongoose.model('User', userSchema)