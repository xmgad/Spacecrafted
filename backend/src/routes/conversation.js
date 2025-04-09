import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import {
    startConversation,
    getAllConversations,
    getConversationById,
    getExistingConversation,
    getConversationMessages,
} from "../controllers/conversationController.js"
const router = Router()

// Fetches an existing conversation for the given users and listing, if one exists
router.post("/get", requireAuth, getExistingConversation)

// Creates a conversation with a starting message, if a matching conversation doesn't alread eixst
router.post("/start", requireAuth, startConversation)

// get all conversations
router.get("/", requireAuth, getAllConversations)

// get conversation by id
router.get("/:id", requireAuth, getConversationById)

// get all messages in conversation
router.post("/:id/messages", requireAuth, getConversationMessages)

export default router
