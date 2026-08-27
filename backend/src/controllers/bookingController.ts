import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/bookingService";
import { z } from "zod";

const bookingInputSchema = z.object({
  roomId: z.string().uuid("Invalid suite ID specification."),
  guestName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Valid email address format required."),
  phone: z.string().min(6, "Valid phone number format required."),
  guests: z.number().int().positive("Must specify at least 1 guest."),
  checkIn: z.string().datetime({ message: "Check-in must be a valid ISO Date string." }).or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Check-in must be in YYYY-MM-DD format.")
  ),
  checkOut: z.string().datetime({ message: "Check-out must be a valid ISO Date string." }).or(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Check-out must be in YYYY-MM-DD format.")
  ),
  specialRequest: z.string().optional(),
});

export class BookingController {
  // Create a booking
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = bookingInputSchema.parse(req.body);
      const booking = await BookingService.createBooking(validatedData);
      res.status(201).json(booking);
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

  // Get specific booking info
  static async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ status: "error", message: "Reservation record not found." });
      }
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  // Cancel reservation
  static async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const booking = await BookingService.cancelBooking(id);
      res.json({ status: "success", message: "Reservation cancelled.", booking });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }

  // Get all bookings (Admin only)
  static async getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  // Update status (Admin only)
  static async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ status: "error", message: "Booking status value required." });
      }

      const booking = await BookingService.updateBookingStatus(id, status);
      res.json(booking);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }
}
