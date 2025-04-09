// Listing related routes

import { Router } from "express"
import { imageUpload } from "../config/s3.config.js"
import {
    createListing,
    deleteListing,
    fetchAllListings,
    fetchMyListings,
    patchListing,
    fetchListingById,
} from "../controllers/listingController.js"
import { requireAuth } from "../middleware/requireAuth.js"
const router = Router()

router.post(
    "/create",
    requireAuth,
    imageUpload.array("images", 10),
    createListing
)

router.delete("/:id", requireAuth, deleteListing)

router.patch("/:id", requireAuth, imageUpload.array("images", 10), patchListing)

// Fetch a specific listing by ID
router.get("/my-listings", requireAuth, fetchMyListings)

router.get("/:id", fetchListingById)

router.get("/", fetchAllListings)

export default router
