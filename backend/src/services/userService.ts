import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  // Sign up a new user
  static async signup(name: string, email: string, passwordString: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(passwordString, 10);

    // 3. Create user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
    });

    // 4. Generate JWT
    const secret = process.env.JWT_SECRET || "hotel_demo_secret_token_key";
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      secret,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    };
  }

  // Log in user
  static async login(email: string, passwordString: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(passwordString, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 3. Sign token
    const secret = process.env.JWT_SECRET || "hotel_demo_secret_token_key";
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  // Get user profile
  static async getUserProfile(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  // Get user's bookings history
  static async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });
  }
}
