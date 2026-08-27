import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

const loginInputSchema = z.object({
  email: z.string().email("Valid email format required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export class AuthController {
  // Admin Login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginInputSchema.parse(req.body);
      const result = await AuthService.login(validatedData.email, validatedData.password);
      
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

  // Admin Logout (Clears client token instructions)
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        status: "success",
        message: "Logout successful. Please discard token from local storage.",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current logged-in admin profile
  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.adminId;
      if (!adminId) {
        return res.status(401).json({ status: "error", message: "Unauthorized credentials." });
      }

      const adminProfile = await AuthService.getAdminProfile(adminId);
      if (!adminProfile) {
        return res.status(404).json({ status: "error", message: "Administrator profile not found." });
      }

      res.json(adminProfile);
    } catch (error) {
      next(error);
    }
  }
}
