import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateUser } from "../middleware/auth";
import { loginLimiter } from "../middleware/rateLimiter";

const router = Router();

// Public routes
router.post("/signup", UserController.signup);
router.post("/login", loginLimiter, UserController.login);

// Private routes
router.get("/me", authenticateUser, UserController.getMe);
router.get("/bookings", authenticateUser, UserController.getBookings);

export default router;
