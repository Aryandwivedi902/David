import prisma from "../config/database";
import { RoomService } from "./roomService";

export class BookingService {
  // Create a reservation booking
  static async createBooking(data: {
    roomId: string;
    guestName: string;
    email: string;
    phone: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    specialRequest?: string;
  }) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // 1. Basic Date Check
    if (checkOut <= checkIn) {
      throw new Error("Invalid dates: Check-out must be after check-in.");
    }

    // 2. Room verification
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    });

    if (!room) {
      throw new Error("Suite configuration not found.");
    }

    if (data.guests > room.capacity) {
      throw new Error(`Guest count exceeds the maximum capacity of ${room.capacity} for this suite.`);
    }

    // 3. Server-side Availability Validation (Prevent Overlapping Bookings)
    const isAvailable = await RoomService.checkRoomAvailability(data.roomId, checkIn, checkOut);
    if (!isAvailable) {
      throw new Error("This suite is already reserved for the selected stay period.");
    }

    // 4. Calculate Nights and Total Amount
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = nights * Number(room.price);

    // 5. Create Booking Record
    return prisma.booking.create({
      data: {
        roomId: data.roomId,
        guestName: data.guestName,
        email: data.email,
        phone: data.phone,
        guests: data.guests,
        checkIn,
        checkOut,
        totalAmount,
        specialRequest: data.specialRequest,
        status: "pending",
      },
      include: {
        room: true,
      },
    });
  }

  // Get specific booking details
  static async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });
  }

  // Cancel reservation
  static async cancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new Error("Reservation record not found.");
    }

    return prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });
  }

  // Get all bookings (Admin dashboard only)
  static async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        room: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Update reservation status (Admin dashboard only)
  static async updateBookingStatus(id: string, status: string) {
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status.toLowerCase())) {
      throw new Error("Invalid status type requested.");
    }

    return prisma.booking.update({
      where: { id },
      data: { status: status.toLowerCase() },
      include: {
        room: true,
      },
    });
  }
}
