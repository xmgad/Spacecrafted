import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import multer from "multer"
import { stageImage } from "../controllers/stagingController.js"
import { locationCoordinates, searchLocation } from "../controllers/locationControllers.js"
const router = Router()

//search location
router.get("/search", searchLocation)

// search get location coordinates
router.get("/coordinates/:place_id", locationCoordinates)

export default router
