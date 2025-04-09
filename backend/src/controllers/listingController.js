import { isValidObjectId } from "mongoose"
import { deleteImage } from "../config/s3.config.js"
import Listing from "../models/listingModel.js"

// fetch listing by id
const fetchListingById = async (req, res) => {
    try {
        const { id } = req.params
        const listing = await Listing.findById(id)
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" })
        }
        res.json(listing)
    } catch (error) {
        console.error("Failed to fetch listing:", error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

// create listing
const createListing = async (req, res) => {
    const userId = req.user._id
    const images = req.files.map((file) => ({
        url: file.location,
        key: file.key,
    }))
    try {
        const data = JSON.parse(req.body.data)
        validateListingData(data)
        const { title, description, price, location } = data
        const listing = await Listing.createListing(
            userId,
            title,
            description,
            price,
            images,
            location
        )
        res.status(200).json(listing)
    } catch (error) {
        // TODO: delete images if creation failed
        res.status(400).json({ error: error.message }) // TODO: send more meaningful error
    }
}

// delete listing
const deleteListing = async (req, res) => {
    try {
        const userId = req.user._id
        const listing = await Listing.findOne({
            _id: req.params.id,
            userId: userId,
        })
        if (!listing) {
            return res.status(404).send({
                message:
                    "Listing not found or you don't have permission to edit specified listing",
            }) // TODO: localize
        }
        // Delete images from S3
        const deletePromises = listing.images.map((image) =>
            deleteImage(image.key)
        )
        await Promise.all(deletePromises)

        // Delete the listing from the db
        await listing.deleteOne()

        res.status(200).json(listing)
    } catch (e) {
        res.status(500).json({
            message: "Failed to delete listing - error: " + e.message,
        }) // TODO: localize
    }
}

// patch listing
const patchListing = async (req, res) => {
    try {
        const userId = req.user._id
        const listing = await Listing.findOne({
            _id: req.params.id,
            userId: userId,
        })
        if (!listing) {
            return res.status(404).send({
                message:
                    "Listing not found or you don't have permission to edit specified listing",
            }) // TODO: localize
        }
        // image keys to remove
        const { removeKeys } = JSON.parse(req.body.remove)
        console.log("REMOVE-KEYS:", removeKeys)
        // get old images and filter out removed images
        const updatedImages = listing.images.filter(
            (image) => !removeKeys.includes(image.key)
        )

        // Get new data
        const newImages = req.files.map((file) => ({
            url: file.location,
            key: file.key,
        }))

        updatedImages.push(...newImages)

        const data = JSON.parse(req.body.data)
        validateListingData(data)
        const { title, description, price, location } = data

        // Update listing with new images and possibly other fields
        listing.title = title
        listing.description = description
        listing.price = price
        listing.location = {
            description: location.description,
            coordinates: {
                longlat: [location.coordinates.lng, location.coordinates.lat],
                type: "Point",
            },
        }
        listing.images = updatedImages
        const newListing = await listing.save()

        // Delete removed images from S3
        const deletePromises = removeKeys.map((key) => {
            console.log("removing:", key)
            deleteImage(key)
        })
        await Promise.all(deletePromises)

        res.status(200).json(newListing)
    } catch (error) {
        // TODO: delete images if patch failed
        console.error("Failed to update listing:", error)
        res.status(500).json({ message: "Failed to update listing" })
    }
}

// Fetch my requests
const fetchMyListings = async (req, res) => {
    // TODO: implement pagination
    const userId = req.user._id
    try {
        const listings = await Listing.find({ userId: userId }).sort({
            createdAt: -1,
        })
        res.status(200).json(listings)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch listings" })
    }
}

const fetchAllListings = async (req, res) => {
    // TODO: implement pagination
    const { term, location } = req.query

    const chainFetch = async () => {
        const queryNoTerm = { ...req.query, term: null }
        const { query } = makeQuery(queryNoTerm)
        const noTermListings = await Listing.find(query).sort({
            createdAt: -1,
        })
        const noTermIds = noTermListings.map((listing) => listing._id)
        const termQuery = { $text: { $search: term }, _id: { $in: noTermIds } }
        const allListings = await Listing.find(termQuery).sort({
            score: { $meta: "textScore" },
            createdAt: -1,
        })
        return allListings
    }
    const singleFetch = async () => {
        const { query, useTextScore } = makeQuery(req.query)
        const sortOptions = useTextScore
            ? { score: { $meta: "textScore" }, createdAt: -1 }
            : { createdAt: -1 }
        const allListings = await Listing.find(query).sort(sortOptions)
        return allListings
    }

    try {
        let listings
        if (term && location) {
            // term and location cannot be done in 1 db query, chain queries
            listings = await chainFetch()
        } else {
            // no index conflict, fetch in 1 query
            listings = await singleFetch()
        }
        res.status(200).json(listings)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch listings" })
    }
}

// fetch Listing by ID
const fetchListing = async (req, res) => {
    // TODO: implement pagination
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid ID" })
        }
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return res
                .status(404)
                .json({ message: "No listing found for the given ID" })
        }
        res.status(200).json(listing)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch listings" })
    }
}

// Auxiliary

const validateListingData = (data) => {
    const { title, description, price, location } = data // TODO: validate listing

    // Check if any of the required fields are missing or empty
    if (!title || !description || !price) {
        throw Error("Please fill in all required fields")
    }

    // type of price
    if (typeof price !== "number") {
        throw Error("Price must be a number")
    }

    // Non-blank details
    if (!title.trim() || !description.trim()) {
        throw Error("Listing details cannot be blank")
    }

    // Non-negative price
    if (price < 0) {
        throw Error(
            "Please enter a valid price value - price cannot be negative"
        )
    }

    // TODO: add location validation (valid coordinates, etc.)

    // all checks passed
}

const getDateFilter = (date) => {
    console.log("Processing date filter for:", date)
    const now = new Date()
    let filter = {}

    switch (date) {
        case "week":
            now.setHours(0, 0, 0, 0)
            now.setDate(now.getDate() - now.getDay())
            console.log("Filter for 'week':", now)
            filter = { createdAt: { $gte: now } }
            break
        case "month":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            console.log("Filter for 'month':", startOfMonth)
            filter = { createdAt: { $gte: startOfMonth } }
            break
        case "year":
            const startOfYear = new Date(now.getFullYear(), 0, 1)
            console.log("Filter for 'year':", startOfYear)
            filter = { createdAt: { $gte: startOfYear } }
            break
        case "any":
            // This intentionally returns an empty object to apply no filter.
            break
        default:
            console.log("No valid date filter found")
            return null // Important to handle unrecognized dates
    }

    console.log("Date filter to apply:", filter)
    return filter
}

// Function to construct the MongoDB query based on request parameters
const makeQuery = (queryParams) => {
    const { term, min_price, max_price, date, location, distance } = queryParams
    let query = {}
    let useTextScore = false

    if (term) {
        query.$text = { $search: term }
        useTextScore = true
    }

    if (min_price || max_price) {
        query.price = {}
        if (min_price) query.price.$gte = parseInt(min_price, 10)
        if (max_price) query.price.$lte = parseInt(max_price, 10)
    }

    if (date) {
        const now = new Date()
        switch (date) {
            case "week":
                now.setHours(0, 0, 0, 0)
                const startOfWeek = new Date(
                    now.setDate(now.getDate() - now.getDay())
                )
                query.createdAt = { $gte: startOfWeek }
                break
            case "month":
                const startOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                )
                query.createdAt = { $gte: startOfMonth }
                break
            case "year":
                const startOfYear = new Date(now.getFullYear(), 0, 1)
                query.createdAt = { $gte: startOfYear }
                break
        }
    }

    if (location) {
        let locationQuery = makeLocationQuery(location, distance)
        if (locationQuery) query["location.coordinates.longlat"] = locationQuery
    }

    return { query, useTextScore }
}

const makeLocationQuery = (location, distance) => {
    const coords = location.split(",")
    if (coords.length !== 2) return null
    const [long, lat] = coords.map((coord) => parseFloat(coord))
    if (isNaN(long) || isNaN(lat)) return null
    let locationQuery = {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [long, lat],
            },
        },
    }
    if (distance) {
        const maxDistance = parseInt(distance, 10) * 1000
        if (maxDistance > 0) locationQuery.$near.$maxDistance = maxDistance
    }

    return locationQuery
}

export {
    createListing,
    deleteListing,
    patchListing,
    fetchMyListings,
    fetchAllListings,
    fetchListing,
    fetchListingById,
}
