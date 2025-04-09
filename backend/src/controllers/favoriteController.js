import User from "../models/userModel.js"
import Listing from "../models/listingModel.js"
import Notification from "../models/notificationModel.js"

// Adds/Removes a given listing to favorites
const favoriteListing = async (req, res) => {
    const listingId = req.params.id
    const userId = req.user._id
    let addedToFavorites = false
    try {
        let user = await User.findById(userId)
        if (!user.favorites) {
            // user doesn't have favorites, create them
            user.favorites = []
        }
        let newFavorites = [...user.favorites]
        let indexOfId = user.favorites.indexOf(listingId)
        const listing = await Listing.findById(listingId)
        if (indexOfId == -1) {
            if (!listing) {
                return res
                    .status(404)
                    .json({ message: "Specified listing not found" })
            }
            addedToFavorites = true
            newFavorites.push(listingId)
        } else newFavorites.splice(indexOfId, 1)
        user.favorites = newFavorites
        await user.save()
        if (addedToFavorites)
            await Notification.createFavoriteNotification(listing, user)
        res.status(200).json({ newFavoriteState: addedToFavorites })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const fetchMyFavorites = async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const favIds = user.favorites
    if (!favIds) {
        return res.status(200).json([])
    }

    const favListings = await Listing.find({ _id: { $in: favIds } })

    res.status(200).json(favListings)
}

export { favoriteListing, fetchMyFavorites }
