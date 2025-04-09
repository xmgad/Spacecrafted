import Listing from "../models/listingModel.js"
import User from "../models/userModel.js"
import Conversation from "../models/chat/conversationModel.js"
import Message from "../models/chat/messageModel.js"
import { deliverMessage } from "../config/socket.config.js"

const getExistingConversation = async (req, res) => {
    const myId = req.user._id
    const { listingId } = req.body
    try {
        const listing = await Listing.findById(listingId)
        if (!listing)
            return res.status(404).json({ message: "Listing not found" })
        const userIds = [myId, listing.userId]
        const existingConversation = await Conversation.getExisting(
            userIds,
            listingId
        )
        // if conversation for given users and listing exists, return it
        if (existingConversation)
            return res.status(200).json(existingConversation)
        // Matching conversation doesn't exist
        res.status(405).json({
            message:
                "An existing conversation does not exist for the given criteria",
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const startConversation = async (req, res) => {
    const myId = req.user._id
    const { listingId, startMessage } = req.body
    try {
        const listing = await Listing.findById(listingId)
        if (!listing)
            return res.status(404).json({ message: "Listing not found" })
        const userIds = [myId, listing.userId]
        const existingConversation = await Conversation.getExisting(
            userIds,
            listingId
        )
        // if conversation for given users and listing exists, return it
        if (existingConversation)
            return res.status(409).json({
                message: "This conversation already exists",
                data: existingConversation,
            })
        // Matching conversation doesn't exist, create one
        const users = await User.find({ _id: { $in: userIds } }).select(
            "_id name"
        )
        const newConversation = await Conversation.createNew(users, listing)

        const message = await createStartingMessage(
            newConversation._id,
            listing.userId,
            myId,
            startMessage
        )
        await deliverMessage(message)
        if (!message) {
            console.warn("Starting message was not created")
        }
        res.status(200).json(newConversation)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllConversations = async (req, res) => {
    const userId = req.user._id
    try {
        const conversations = await Conversation.find({
            "participants.userId": userId,
        }).sort({ updatedAt: -1 }) // sort by last message date
        const unreadConversations = await getUnreadConversationIds(userId)
        let response = conversations.map((conversation) => {
            const hasNewMessages = unreadConversations.includes(
                conversation._id
            )
            return { conversation, hasNewMessages }
        })

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getConversationById = async (req, res) => {
    const userId = req.user._id
    const conversationId = req.params.id
    try {
        const conversation = await Conversation.findOne({
            _id: conversationId,
            "participants.userId": userId,
        })
        if (conversation) return res.status(200).json(conversation)
        res.status(404).json({
            message:
                "A conversation with the given ID does not exist or you do not have access to it",
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getConversationMessages = async (req, res) => {
    const userId = req.user._id
    const conversationId = req.params.id
    const {markAsRead} = req.body
    try {
        // Check if conversation exists and is accessible
        const conversation = await Conversation.findOne({
            _id: conversationId,
            "participants.userId": userId,
        })
        if (!conversation)
            res.status(404).json({
                message:
                    "A conversation with the given ID does not exist or you do not have access to it",
            })
        // Get all messages for this conversation
        const messages = await Message.find({ conversationId })
        // If request specifies markAsRead, mark all messages as read
        if (markAsRead) {
            // TODO: filter unreads here before update query (performance)
            const messageIds = messages.map((msg) => msg._id)
            await Message.updateMany(
                {
                    _id: {$in: messageIds},
                    recipientId: userId,
                    status: { $ne: "read" },
                },
                {
                    status: "read",
                }
            )
        }
        // Return messages
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// Auxiliary
const getUnreadConversationIds = async (userId) => {
    return await Message.distinct("conversationId", {
        recipientId: userId,
        status: { $ne: "read" },
    })
}

const createStartingMessage = async (
    conversationId,
    recipientId,
    senderId,
    content
) => {
    const message = await Message.create({
        conversationId,
        content,
        senderId,
        recipientId,
        status: "saved",
    })
    return message
}

export {
    getExistingConversation,
    startConversation,
    getAllConversations,
    getConversationById,
    getConversationMessages,
}
