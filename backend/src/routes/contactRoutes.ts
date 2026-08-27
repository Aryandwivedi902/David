import { Router } from "express";
import { ContactController } from "../controllers/contactController";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// Guest route to send contact messages
router.post("/", ContactController.createContactMessage);

// Admin route to retrieve all messages (mounted as /api/admin/messages or within auth checks)
router.get("/messages", authenticateAdmin, ContactController.getAllMessages);

export default router;
