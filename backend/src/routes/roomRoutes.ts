import { Router } from "express";
import { RoomController } from "../controllers/roomController";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", RoomController.getAllRooms);
router.get("/availability", RoomController.getAvailableRooms);
router.get("/:slug", RoomController.getRoomBySlug);

// Protected routes (Admin only)
router.post("/", authenticateAdmin, RoomController.createRoom);
router.put("/:id", authenticateAdmin, RoomController.updateRoom);
router.delete("/:id", authenticateAdmin, RoomController.deleteRoom);

export default router;
