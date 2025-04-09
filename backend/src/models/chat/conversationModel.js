import mongoose from "mongoose"

const Schema = mongoose.Schema

const participantSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: { type: String, required: true },
})

const conversationSchema = new Schema(
    {
        title: { type: String, required: true },

        participants: {
            type: [participantSchema],
            required: true,
        },

        listingId: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },

        imageUrl: { type: String },
    },
    { timestamps: true }
)

conversationSchema.index({ "participants.userId": 1 })

// statics

conversationSchema.statics.getExisting = async function (userIds, listingId) {
    const users = userIds.map((id) => new mongoose.Types.ObjectId(id))
    const conversation = await this.findOne({
        "participants.userId": { $all: users },
        listingId: listingId,
    })

    return conversation
}

conversationSchema.statics.createNew = async function (users, listing) {
    const participants = users.map((user) => {
        return { userId: new mongoose.Types.ObjectId(user._id), name: user.name }
    })
    const listingImage = listing.images[0].url

    const conversation = await this.create({
        title: listing.title,
        participants,
        listingId: listing._id,
        imageUrl: listingImage,
    })

    return conversation
}

export default mongoose.model("Conversation", conversationSchema)
