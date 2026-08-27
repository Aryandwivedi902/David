import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabaseData() {
  console.log("\n================ [DATABASE DATA REPORT] ================");
  try {
    // 1. Get Rooms catalog count and details
    const roomsCount = await prisma.room.count();
    const rooms = await prisma.room.findMany({
      select: { name: true, price: true, capacity: true }
    });
    console.log(`\n🏡 SUITE CATALOG (${roomsCount} Suites Available):`);
    rooms.forEach((r, idx) => {
      console.log(`   ${idx + 1}. ${r.name} - $${r.price}/night (Max ${r.capacity} guests)`);
    });

    // 2. Get Bookings count and details
    const bookingsCount = await prisma.booking.count();
    const bookings = await prisma.booking.findMany({
      include: { room: true }
    });
    console.log(`\n📅 CLIENT RESERVATION BOOKINGS (${bookingsCount} Stays Registered):`);
    if (bookingsCount === 0) {
      console.log("   (No clients have booked a suite yet. Submit a booking on http://localhost:3000/booking!)");
    } else {
      bookings.forEach((b, idx) => {
        console.log(`   ${idx + 1}. Guest: ${b.guestName} | Email: ${b.email} | Suite: ${b.room.name} | Status: ${b.status}`);
      });
    }

    // 3. Get Contact Inquiries count
    const messagesCount = await prisma.contact.count();
    console.log(`\n✉️ CLIENT INQUIRIES & MESSAGES (${messagesCount} Messages Received):`);
    if (messagesCount === 0) {
      console.log("   (No customer contact messages in database yet.)");
    } else {
      const messages = await prisma.contact.findMany();
      messages.forEach((m, idx) => {
        console.log(`   ${idx + 1}. From: ${m.name} | Msg: "${m.message.substring(0, 50)}..."`);
      });
    }

  } catch (error) {
    console.error("Failed to run database diagnostic:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n======================================================\n");
  }
}

checkDatabaseData();
