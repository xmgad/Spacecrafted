import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import multer from "multer"
import { stageImage } from "../controllers/stagingController.js"
import { stageUpload } from "../config/s3.config.js"
const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//stage an image
router.post("/", requireAuth, stageUpload.single("image"), stageImage)

export default router
