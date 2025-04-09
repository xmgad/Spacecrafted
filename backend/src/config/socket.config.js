import { Server } from "socket.io"
import Message from "../models/chat/messageModel.js"
import Conversation from "../models/chat/conversationModel.js"
import Notification from "../models/notificationModel.js"

const connectedUsers = {}
const openConversations = {}

const saveMessage = async (message) => {
    const { conversationId, content, senderId, recipientId } = message
    let status = "saved"
    if (connectedUsers[recipientId]) status = "delivered"
    if (openConversations[recipientId] === conversationId) status = "read"
    try {
        const message = await Message.create({
            conversationId,
            content,
            senderId,
            recipientId,
            status,
        })
        if (!message) throw new Error("Failed to save message")

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            updatedAt: new Date(),
        })
        // Create notification if message not delivered
        if (status === "saved")
            Notification.createMessageNotification(
                conversationId,
                senderId,
                recipientId
            )
    } catch (error) {
        throw error
    }
}

let sio

const startSocket = (server) => {
    sio = new Server(server)

    sio.on("connection", (socket) => {
        const userId = socket.handshake.query.userId
        connectedUsers[userId] = socket.id
        console.log(`User ${userId} connected to socket ${socket.id}! connected:`, connectedUsers)
        socket.on("sendMessage", async (message, callback) => {
            try {
                // save message to db
                await saveMessage(message)
                console.log("received. connected:", connectedUsers);
                if (connectedUsers[message.recipientId]) {
                    sio.to(connectedUsers[message.recipientId]).emit(
                        "receiveMessage",
                        message
                    )
                    if (
                        message.conversationId ===
                        openConversations[message.recipientId]
                    )
                        callback({ status: "read" })
                    else callback({ status: "delivered" })
                } else {
                    callback({ status: "saved" })
                }
            } catch (error) {
                callback({ error: error.message })
            }
        })

        socket.on("openConversation", (conversationId) => {
            console.log("SEND OPEN:", conversationId)
            if (conversationId) openConversations[userId] = conversationId
            else delete openConversations[userId]
        })

        socket.on("disconnect", () => {
            delete openConversations[userId]
            delete connectedUsers[userId]
            console.log(`User ${userId} disconnected! connected:`, connectedUsers)
        })
    })
}

const deliverMessage = async (message) => {
    if (!connectedUsers[message.recipientId]) {
        // user not connected, create notification
        const { conversationId, senderId, recipientId } = message
        Notification.createMessageNotification(
            conversationId,
            senderId,
            recipientId
        )
    }
    if (!sio) return
    if (connectedUsers[message.recipientId]) {
        sio.to(connectedUsers[message.recipientId]).emit(
            "receiveMessage",
            message
        )
    }
}

export { startSocket, deliverMessage }
