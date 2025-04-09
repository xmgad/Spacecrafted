import dotenv from "dotenv"
dotenv.config()
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
//to add salt to password
import bcrypt from "bcryptjs"
//package to send E-mails
import nodemailer from "nodemailer"

const createJWT = (id) => {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "3d" })
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password, userType } = req.body

    try {
        const user = await User.registerUser(email, password, name, userType)
        const jwt = createJWT(user._id)
        res.status(200).json({ id: user._id, name, userType, token: jwt })
    } catch (error) {
        res.status(400).json({ error: error.message }) // TODO: send more meaningful error
    }
}

// update Subscription if agent

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.authenticate(email, password)
        const jwt = createJWT(user._id)
        res.status(200).json({
            id: user._id,
            name: user.name,
            userType: user.userType,
            token: jwt,
        })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

// fetch my user
const fetchMyUser = async (req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "User not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message }) // TODO: send more meaningful error
    }
}

// fetch specific field from my user
const fetchMyUserField = async (req, res) => {
    const userId = req.user._id
    const field = req.params.field
    try {
        const user = await User.findById(userId).select(field)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "User not found" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message }) // TODO: send more meaningful error
    }
}

//send Email using nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
})

//send a 6 digit otp
const sendOTP = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        // Generates a 6-digit OTP
        const otp = Math.floor(Math.random() * 1000000).toString()
        // OTP expires in 30 minutes
        user.otp = { code: otp, expires: new Date(Date.now() + 30 * 60000) }
        await user.save()

        // Send OTP
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Password Recovery OTP",
            text: `Your OTP will expire in 30 Minutes here is the OTP:${otp}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Mail sending error:", error)
                return res.status(500).json({ error: "Error sending email" })
            }
            res.status(200).json({ message: "OTP sent to email" })
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
// Password reset
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user || !user.otp || user.otp.expires < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" })
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({ error: "Incorrect OTP" })
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        // Clear the OTP field
        user.otp = undefined
        //save new Password
        await user.save()

        res.status(200).json({
            message: "Password has been reset successfully",
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export {
    registerUser,
    loginUser,
    sendOTP,
    resetPassword,
    fetchMyUser,
    fetchMyUserField,
}
