import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export interface UserAuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token missing or invalid. Please login.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "hotel_demo_secret_token_key";
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Session expired or invalid token credentials.",
    });
  }
};

export const authenticateUser = (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authorization token missing or invalid. Please login.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "hotel_demo_secret_token_key";
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Session expired or invalid token credentials.",
    });
  }
};

