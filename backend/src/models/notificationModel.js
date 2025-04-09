import mongoose from "mongoose"
import Conversation from "./chat/conversationModel.js"

const Schema = mongoose.Schema

const notificationSchema = new Schema(
    {
        title: { type: String, required: true },

        message: { type: String, required: true },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["favorite", "message", "other"],
            required: true,
        },

        actionId: { type: String },

        imageUrl: { type: String },

        senderId: { type: String },

        isSeen: { type: Boolean, default: false },

        seenAt: { type: Date },
    },
    { timestamps: true }
)

// Index for receiver ID for more efficient retrievals
notificationSchema.index({ receiverId: 1 })
// Index
notificationSchema.index({ seenAt: 1 }, { expireAfterSeconds: 604800 }) // 1 week TTL

notificationSchema.statics.createFavoriteNotification = async function (
    listing,
    user
) {
    // if self-favorite, don't create a notification
    if (user._id.toString() === listing.userId.toString()) {
        return
    }
    const notifTitle = "New Listing Favorite"
    const notifMessage = `User ${user.name} just added your listing "${listing.title}" to their favorites!`
    const listingImage = listing.images[0].url
    const notification = await this.create({
        title: notifTitle,
        message: notifMessage,
        receiverId: listing.userId,
        type: "favorite",
        actionId: listing._id,
        imageUrl: listingImage,
        senderId: user._id,
    })

    return notification
}

const nameForSender = (senderId, participants) => {
    console.log("SENDER", senderId)
    console.log("PARTS", participants)
    return participants.find(
        (participant) => participant.userId.toString() === senderId.toString()
    ).name
}

notificationSchema.statics.createMessageNotification = async function (
    conversationId,
    senderId,
    recipientId
) {
    const existing = await this.findOne({
        actionId: conversationId,
        receiverId: recipientId,
        type: "message",
        isSeen: false,
    })
    // User already notified about this message, and hasn't seen notif yet
    if (existing) return

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) throw new Error("Conversation not found")
    const senderName = nameForSender(senderId, conversation.participants)
    const notifTitle = `New messages from ${senderName}`
    const notifMessage = `User ${senderName} sent you new messages on your conversation "${conversation.title}"`
    const notification = await this.create({
        title: notifTitle,
        message: notifMessage,
        receiverId: recipientId,
        type: "message",
        actionId: conversationId,
        imageUrl: conversation.imageUrl,
        senderId: senderId,
    })
    console.log("Message notification created")
    return notification
}

export default mongoose.model("Notification", notificationSchema)
