import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  // Authenticate administrator
  static async login(email: string, passwordString: string) {
    // 1. Locate admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      throw new Error("Invalid email or password.");
    }

    // 2. Compare bcrypt hashes
    const isPasswordValid = await bcrypt.compare(passwordString, admin.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 3. Sign jwt token
    const secret = process.env.JWT_SECRET || "hotel_demo_secret_token_key";
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      secret,
      { expiresIn: "7d" } // Admin session stays active for 7 days
    );

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token,
    };
  }

  // Get admin profile by identity ID (token verification)
  static async getAdminProfile(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
