import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { getMyNotifications, newNotificationCount, seeAllNotifications } from "../controllers/notificationController.js"
const router = Router()

// get my notifications
router.get("/", requireAuth, getMyNotifications)

// mark all my notifications as seen
router.patch("/see-all", requireAuth, seeAllNotifications)

// get the number of new (unseen) notifications
router.get("/new-count", requireAuth, newNotificationCount)

export default router
