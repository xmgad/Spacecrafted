import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { favoriteListing, fetchMyFavorites } from "../controllers/favoriteController.js"
const router = Router()

// favorite a listing
router.post("/:id", requireAuth, favoriteListing)

router.get("/", requireAuth, fetchMyFavorites)

export default router
