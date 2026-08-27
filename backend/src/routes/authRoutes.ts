import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateAdmin } from "../middleware/auth";
import { loginLimiter } from "../middleware/rateLimiter";

const router = Router();

// Admin login (rate-limited)
router.post("/login", loginLimiter, AuthController.login);

// Admin logout
router.post("/logout", AuthController.logout);

// Admin session verification
router.get("/me", authenticateAdmin, AuthController.getMe);

export default router;
