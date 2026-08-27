import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { z } from "zod";

const contactInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Valid email address format required."),
  phone: z.string().min(6, "Valid phone number format required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export class ContactController {
  // Create a contact message inquiry
  static async createContactMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = contactInputSchema.parse(req.body);

      const contact = await prisma.contact.create({
        data: validatedData,
      });

      res.status(201).json({
        status: "success",
        message: "Message received. Our staff will contact you shortly.",
        contact,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed.",
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  // Get all contact messages (Admin dashboard viewing)
  static async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
}
