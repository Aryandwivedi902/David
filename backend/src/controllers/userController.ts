import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { UserAuthRequest } from "../middleware/auth";
import { z } from "zod";

const signupInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Valid email format required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginInputSchema = z.object({
  email: z.string().email("Valid email format required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export class UserController {
  // User Registration
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = signupInputSchema.parse(req.body);
      const result = await UserService.signup(
        validatedData.name,
        validatedData.email,
        validatedData.password
      );

      res.status(201).json({
        status: "success",
        message: "Registration successful.",
        ...result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed.",
          errors: error.errors,
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }

  // User Login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginInputSchema.parse(req.body);
      const result = await UserService.login(validatedData.email, validatedData.password);

      res.json({
        status: "success",
        message: "Login successful.",
        ...result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed.",
          errors: error.errors,
        });
      }
      if (error instanceof Error) {
        return res.status(401).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }

  // Get current logged-in user profile
  static async getMe(req: UserAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized credentials." });
      }

      const userProfile = await UserService.getUserProfile(userId);
      if (!userProfile) {
        return res.status(404).json({ status: "error", message: "User profile not found." });
      }

      res.json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  // Get current user's booking history
  static async getBookings(req: UserAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized credentials." });
      }

      const bookings = await UserService.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }
}
