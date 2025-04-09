import mongoose from "mongoose"

const Schema = mongoose.Schema

const coordinatesSchema = new Schema(
    {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        longlat: {
            type: [Number], // [long, lat]
            required: true,
        },
    },
    { _id: false }
)

coordinatesSchema.index({ longlat: "2dsphere" })

const locationSchema = new Schema({
    coordinates: {
        type: coordinatesSchema,
        required: true,
    },
    description: {
        type: String,
    },
})

const imageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
})

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
            max: 1000000000,
        },

        images: {
            type: [imageSchema],
            required: true,
        },
        location: {
            type: locationSchema,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
)

listingSchema.index({
    title: "text",
    description: "text",
    "location.description": "text",
})

// Index for user ID for more efficient retrievals
listingSchema.index({ userId: 1 })

listingSchema.statics.createListing = async function (
    userId,
    title,
    description,
    price,
    images,
    location
) {
    if (!title || !description || !price || !images || !location) {
        throw Error("Please provide all required listing info") // TODO: localize
    }

    const { lat, lng } = location.coordinates
    const loc = {
        description: location.description,
        coordinates: { longlat: [lng, lat], type: "Point" },
    }

    const listing = await this.create({
        title,
        description,
        price,
        images: images,
        location: loc,
        userId,
    })

    return listing
}

export default mongoose.model("Listing", listingSchema)
