import { Request, Response, NextFunction } from "express";
import { RoomService } from "../services/roomService";
import { z } from "zod";

// Zod schema validation for creating/editing rooms
const roomInputSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.number().positive("Price must be a positive number."),
  capacity: z.number().int().positive("Capacity must be at least 1 guest."),
  bedType: z.string().min(2, "Bed configuration type required."),
  size: z.number().int().positive("Room size must be positive square meters."),
  imageUrl: z.string().url("Valid image URL required."),
  amenities: z.array(z.string()).default([]),
});

export class RoomController {
  // Get all rooms
  static async getAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  // Get single room details
  static async getRoomBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const room = await RoomService.getRoomBySlug(slug);
      if (!room) {
        return res.status(404).json({ status: "error", message: "Suite not found." });
      }
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  // Find available rooms based on check-in, check-out, and guest count
  static async getAvailableRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { checkIn, checkOut, guests } = req.query;

      if (!checkIn || !checkOut) {
        return res.status(400).json({
          status: "error",
          message: "Check-in and check-out dates are required query parameters.",
        });
      }

      const guestCount = guests ? parseInt(guests as string) : 1;
      const availableRooms = await RoomService.getAvailableRooms(
        checkIn as string,
        checkOut as string,
        guestCount
      );

      res.json(availableRooms);
    } catch (error) {
      next(error);
    }
  }

  // Create room (Admin only)
  static async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = roomInputSchema.parse(req.body);
      const room = await RoomService.createRoom(validatedData);
      res.status(201).json(room);
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

  // Update room (Admin only)
  static async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Partial validation for edit requests
      const validatedData = roomInputSchema.partial().parse(req.body);
      const room = await RoomService.updateRoom(id, validatedData);
      res.json(room);
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

  // Delete room (Admin only)
  static async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await RoomService.deleteRoom(id);
      res.json({ status: "success", message: "Suite deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
