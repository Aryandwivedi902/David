import express from "express";
import cors from "cors";
import helmet from "helmet";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { authenticateAdmin } from "./middleware/auth";

// Routes imports
import roomRoutes from "./routes/roomRoutes";
import { bookingRoutes, adminBookingRoutes } from "./routes/bookingRoutes";
import contactRoutes from "./routes/contactRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Apply rate limiter to all routes
app.use(generalLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Mount Public API routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Mount Protected Admin API routes
app.use("/api/admin/bookings", authenticateAdmin, adminBookingRoutes);
app.use("/api/admin/rooms", authenticateAdmin, roomRoutes);
app.use("/api/admin", authenticateAdmin, contactRoutes); // handles /api/admin/messages

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Requested API endpoint not found.",
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
