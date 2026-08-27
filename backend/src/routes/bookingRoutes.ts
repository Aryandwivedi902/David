import { Router } from "express";
import { BookingController } from "../controllers/bookingController";
import { authenticateAdmin } from "../middleware/auth";
import { bookingLimiter } from "../middleware/rateLimiter";

const router = Router();

// Guest booking routes (public, rate-limited)
router.post("/", bookingLimiter, BookingController.createBooking);
router.get("/:id", BookingController.getBookingById);
router.post("/:id/cancel", BookingController.cancelBooking);

// Admin-specific booking routes (mounted as /api/admin/bookings in app.ts)
const adminRouter = Router();
adminRouter.get("/", authenticateAdmin, BookingController.getAllBookings);
adminRouter.patch("/:id/status", authenticateAdmin, BookingController.updateBookingStatus);

export { router as bookingRoutes, adminRouter as adminBookingRoutes };
