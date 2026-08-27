import rateLimit from "express-rate-limit";

// Rate limit for booking checkouts (max 10 requests per 15 mins)
export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: "Too many reservations attempted from this network location. Please retry in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for admin authentication attempts (max 5 requests per 15 mins)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many login attempts recorded. Please wait 15 minutes before retrying.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General application rate limit (max 100 requests per 1 minute)
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    message: "API rate limit reached. Please reduce requests.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
