import mongoose from "mongoose"
const Schema = mongoose.Schema

const messageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        recipientId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["saved", "delivered", "read"],
            default: "saved",
            required: true,
        },
    },
    { timestamps: true }
)

// TODO: implement TTL index?

// Index for conversation ID for more efficient retrievals
messageSchema.index({ conversationId: 1 })
// Index for recipient ID for unread message retrievals
messageSchema.index({ recipientId: 1 })

export default mongoose.model("Message", messageSchema)
