import prisma from "../config/database";

export class RoomService {
  // Retrieve all rooms
  static async getAllRooms() {
    return prisma.room.findMany({
      include: {
        amenities: true,
      },
      orderBy: {
        price: "asc",
      },
    });
  }

  // Retrieve room by slug
  static async getRoomBySlug(slug: string) {
    return prisma.room.findUnique({
      where: { slug },
      include: {
        amenities: true,
      },
    });
  }

  // Check if a specific room is available for given dates
  static async checkRoomAvailability(roomId: string, checkIn: Date, checkOut: Date) {
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: "cancelled" }, // Don't count cancelled bookings
        OR: [
          {
            // Case 1: Existing booking check-in is between new check-in/out
            checkIn: {
              lt: checkOut,
              gte: checkIn,
            },
          },
          {
            // Case 2: Existing booking check-out is between new check-in/out
            checkOut: {
              gt: checkIn,
              lte: checkOut,
            },
          },
          {
            // Case 3: Existing booking fully covers the new check-in/out
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gte: checkOut } },
            ],
          },
        ],
      },
    });

    return overlappingBookings.length === 0;
  }

  // Find all rooms available for a stay period
  static async getAvailableRooms(checkInStr: string, checkOutStr: string, guests: number) {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    // Get all rooms that meet the guest capacity requirement
    const eligibleRooms = await prisma.room.findMany({
      where: {
        capacity: { gte: guests },
        available: true,
      },
      include: {
        amenities: true,
      },
    });

    // Check availability for each room in parallel
    const availableRooms = [];
    for (const room of eligibleRooms) {
      const isAvailable = await this.checkRoomAvailability(room.id, checkIn, checkOut);
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }

  // Create a room (Admin only)
  static async createRoom(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    capacity: number;
    bedType: string;
    size: number;
    imageUrl: string;
    amenities: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          capacity: data.capacity,
          bedType: data.bedType,
          size: data.size,
          imageUrl: data.imageUrl,
        },
      });

      if (data.amenities && data.amenities.length > 0) {
        await tx.roomAmenity.createMany({
          data: data.amenities.map((item) => ({
            roomId: room.id,
            amenity: item,
          })),
        });
      }

      return tx.room.findUnique({
        where: { id: room.id },
        include: { amenities: true },
      });
    });
  }

  // Update a room (Admin only)
  static async updateRoom(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      capacity?: number;
      bedType?: string;
      size?: number;
      imageUrl?: string;
      amenities?: string[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // Update room details
      await tx.room.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          capacity: data.capacity,
          bedType: data.bedType,
          size: data.size,
          imageUrl: data.imageUrl,
        },
      });

      // Update amenities if provided
      if (data.amenities) {
        // Remove old amenities
        await tx.roomAmenity.deleteMany({
          where: { roomId: id },
        });

        // Add new amenities
        if (data.amenities.length > 0) {
          await tx.roomAmenity.createMany({
            data: data.amenities.map((item) => ({
              roomId: id,
              amenity: item,
            })),
          });
        }
      }

      return tx.room.findUnique({
        where: { id },
        include: { amenities: true },
      });
    });
  }

  // Delete a room (Admin only)
  static async deleteRoom(id: string) {
    return prisma.room.delete({
      where: { id },
    });
  }
}
