import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear existing database records
  await prisma.booking.deleteMany({});
  await prisma.roomAmenity.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.contact.deleteMany({});

  console.log("Database cleared.");

  // 2. Create Default Administrator
  const adminEmail = "admin@grandhorizon.com";
  const passwordText = "admin1234";
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(passwordText, saltRounds);

  const admin = await prisma.admin.create({
    data: {
      name: "Grand Horizon Administrator",
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`Demo administrator created: ${admin.email}`);

  // 3. Create 10 Luxury Rooms
  const roomsData = [
    {
      name: "Oceanfront Horizon Suite",
      slug: "oceanfront-horizon-suite",
      description: "Perched directly over the Malibu coastline, the Oceanfront Horizon Suite offers panoramic sunset vistas from your private teak deck. Featuring floor-to-ceiling glass walls, a signature king-sized bed, and private outdoor soaking tub, it is the ultimate couple's escape.",
      price: 18000.00,
      capacity: 2,
      bedType: "King",
      size: 75,
      imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
      amenities: ["Panoramic Ocean View", "Private Teak Sun Deck", "Outdoor Soaking Tub", "24/7 Butler Service", "Espresso Sommelier Station", "iPad Room Control"]
    },
    {
      name: "Sunset Riviera Villa",
      slug: "sunset-riviera-villa",
      description: "Our signature double-suite estate, the Sunset Riviera Villa blends limestone architecture with modern minimal luxury. This private retreat features a heated saltwater plunge pool, outdoor fire pit, fully-equipped chef's pantry, and direct private beach access.",
      price: 32000.00,
      capacity: 4,
      bedType: "King",
      size: 140,
      imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600",
      amenities: ["Heated Plunge Pool", "Direct Beach Access", "Coastal Fire Pit", "Personal Chef Prep", "Wine Chiller Stocked", "Airport Helipad Pickups"]
    },
    {
      name: "Presidential Penthouse Suite",
      slug: "presidential-penthouse-suite",
      description: "Commanding the highest elevation of the resort, the Presidential Penthouse represents the absolute pinnacle of luxury. Covering over 240 square meters of custom marble craftsmanship, it contains two king suites, a formal dining table for eight, private movie theater, and a wraps-around infinity sky pool.",
      price: 65000.00,
      capacity: 6,
      bedType: "King",
      size: 245,
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600",
      amenities: ["Wrap-around Sky Pool", "Private Movie Theater", "Formal Dining Area", "Security Guard Vault", "Premium Sound System", "Complimentary Yacht Day"]
    },
    {
      name: "Coastal Garden Villa",
      slug: "coastal-garden-villa",
      description: "Nestled in our luxury, landscaped botanical grounds, the Coastal Garden Villa offers a serene sanctuary focused on wellness. Surrounded by jasmine blossoms and calming waterfalls, it contains a private Zen meditation garden, infrared sauna, and outdoor steam rain shower.",
      price: 12500.00,
      capacity: 3,
      bedType: "Queen",
      size: 90,
      imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600",
      amenities: ["Zen Botanical Garden", "Private Infrared Sauna", "Outdoor Rain Shower", "Meditation Yoga Mats", "Therapeutic Bath Menu", "Organic Juice Delivery"]
    },
    {
      name: "Serenity Wellness Suite",
      slug: "serenity-wellness-suite",
      description: "Engineered specifically for therapeutic restoration, the Serenity Wellness Suite integrates lighting therapy, dynamic sleep mattress configurations, and high-performance air purification. Enjoy private in-room spa treatments and customized nutritional menus prepared by our wellness chefs.",
      price: 20000.00,
      capacity: 2,
      bedType: "King",
      size: 85,
      imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600",
      amenities: ["Circadian Light Therapy", "In-room Treatment Area", "Sleep Mattress System", "Hepa Air Purification", "Aromatherapy Diffusion", "Wellness Chef Access"]
    },
    {
      name: "Royal Beachfront Pavilion",
      slug: "royal-beachfront-pavilion",
      description: "An grand oceanfront residence featuring expansive living rooms, floor-to-ceiling sliding glass panels, and private gardens. Located directly on the sands of Malibu Beach, it is ideal for family retreats requiring complete privacy and dedicated concierge assistance.",
      price: 42000.00,
      capacity: 5,
      bedType: "King",
      size: 190,
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600",
      amenities: ["Oceanfront Deck", "Private Courtyard", "Personal Concierge", "Private Dining Chef", "Stocked Bar Pantry", "Heated Spa Tub"]
    },
    {
      name: "Panoramic Sapphire Suite",
      slug: "panoramic-sapphire-suite",
      description: "Wake up to breathtaking 180-degree ocean views. The Panoramic Sapphire Suite combines blue coastal palettes with modern luxury. Features a king bed, custom marble bath, private balcony, and direct room control via iPad.",
      price: 24000.00,
      capacity: 2,
      bedType: "Queen",
      size: 105,
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600",
      amenities: ["180-Degree Ocean View", "Private Balcony", "Custom Marble Bath", "Smart Room Control", "Coffee Bar Station", "VIP Turndown Service"]
    },
    {
      name: "Sanctuary Twin Villa",
      slug: "sanctuary-twin-villa",
      description: "Perfect for corporate guests or family friends, the Sanctuary Twin Villa features two deluxe twin beds with organic premium linens, a shared lounge area, custom glass-enclosed bathroom, and an outdoor garden patio with comfortable chairs.",
      price: 16000.00,
      capacity: 4,
      bedType: "Twin",
      size: 95,
      imageUrl: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=600",
      amenities: ["Two Twin Beds", "Garden Patio Deck", "Deluxe Lounge Area", "Premium Linens", "Separate Rainforest Showers", "Custom In-room Minibar"]
    },
    {
      name: "Executive Horizon Studio",
      slug: "executive-horizon-studio",
      description: "Designed for business travelers or short stays, the Executive Horizon Studio has a workspace desk, high-speed Wi-Fi, double bed, and marble shower. Offers direct access to the resort business center and helipad transfers.",
      price: 11000.00,
      capacity: 2,
      bedType: "Double",
      size: 55,
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600",
      amenities: ["Ergonomic Desk Workspace", "Double Bed Comfort", "Marble Rain Shower", "High-speed Wi-Fi", "Espresso Station", "Access to Lounge Desk"]
    },
    {
      name: "Grand Vista Family Villa",
      slug: "grand-vista-family-villa",
      description: "Our premier family suite containing three large bedrooms with queen-sized configurations, a spacious communal living room, full kitchen amenities, and a massive oceanfront balcony equipped with chairs and dinner tables.",
      price: 36000.00,
      capacity: 6,
      bedType: "Queen",
      size: 170,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
      amenities: ["3 Queen Bedrooms", "Massive Balcony Deck", "Fully Equipped Kitchen", "Communal Living Room", "Washer and Dryer", "Complimentary Kid's Club"]
    }
  ];

  for (const r of roomsData) {
    const room = await prisma.room.create({
      data: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        price: r.price,
        capacity: r.capacity,
        bedType: r.bedType,
        size: r.size,
        imageUrl: r.imageUrl,
      },
    });

    await prisma.roomAmenity.createMany({
      data: r.amenities.map((item) => ({
        roomId: room.id,
        amenity: item,
      })),
    });

    console.log(`Room created: ${room.name} with ${r.amenities.length} amenities.`);
  }

  console.log("Database seeding completed successfully with 10 rooms!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
