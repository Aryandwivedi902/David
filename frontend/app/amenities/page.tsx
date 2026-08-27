"use client";

import { motion } from "framer-motion";
import { Compass, Waves, Snowflake, Wine, ShieldCheck, Ship, Utensils } from "lucide-react";

interface AmenityDetail {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  hours: string;
  features: string[];
  imageUrl: string;
}

export default function AmenitiesPage() {
  const amenitiesList: AmenityDetail[] = [
    {
      icon: <Waves className="w-6 h-6 text-accent" />,
      title: "Infinity Ocean Pool",
      subtitle: "Heated salt-water coastal deck",
      description: "Carved into the beachfront cliffside, our heated saltwater infinity pool blends seamlessly into the ocean's horizon. Experience temperature-regulated lounge cabanas and tailored cocktail services.",
      hours: "07:00 AM - 10:00 PM",
      features: ["Heated cabanas", "Poolside service", "Towel service"],
      imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600",
    },
    {
      icon: <Snowflake className="w-6 h-6 text-accent" />,
      title: "Zen Thermal Spa & Bathhouse",
      subtitle: "Holistic sensory recovery center",
      description: "A sanctuary for body and mind. Enjoy thermal mineral springs, cold plunges, dry wood saunas, and custom oil-infused therapy sessions curated by global healing experts.",
      hours: "08:00 AM - 08:00 PM",
      features: ["Infrared saunas", "Cold plunge bath", "Bespoke massages"],
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    },
    {
      icon: <Wine className="w-6 h-6 text-accent" />,
      title: "The Sunset Tasting Room",
      subtitle: "Curated vintage sommelier list",
      description: "Housing over 10,000 vintages from France, Italy, and California, our dark-oak cellar and outdoor sommelier deck hosts nightly tastings paired with local artisan cheese arrays.",
      hours: "05:00 PM - Midnight",
      features: ["Private cellar tours", "Cheese pairings", "Exclusive reserves"],
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600",
    },
    {
      icon: <Utensils className="w-6 h-6 text-accent" />,
      title: "L'Orizzonte Restaurant",
      subtitle: "Michelin-starred coastal dining",
      description: "Led by internationally acclaimed chefs, L'Orizzonte crafts elegant seafood-forward dishes focusing on organic, local ingredients paired with coastal sunset views.",
      hours: "Breakfast: 07-11 AM | Dinner: 06-10 PM",
      features: ["Oceanfront deck", "Sommelier-recommended menu", "Private chef tables"],
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
    },
    {
      icon: <Ship className="w-6 h-6 text-accent" />,
      title: "Bespoke Yacht Charters",
      subtitle: "Private coastal sailing",
      description: "Explore the scenic Malibu coastline aboard our private 80-foot luxury catamarans. Book tailored sunset cruises, snorkel trips, or deep-sea champagne brunches.",
      hours: "On-Demand Scheduling",
      features: ["Private captains", "Onboard catering", "Jet-ski additions"],
      imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-accent" />,
      title: "Bespoke Concierge & Security",
      subtitle: "Restricted private estate",
      description: "Enjoy full safety and privacy. Our 24/7 client relations staff coordinates secure custom travel, helicopter transfers, and exclusive VIP itineraries.",
      hours: "Available 24 Hours",
      features: ["Helicopter transfers", "VIP access booking", "Secured parking"],
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600",
    },
  ];

  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-accent" />
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Amenities & Facilities</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 uppercase">
            A World of Crafted Indulgence
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto font-sans leading-relaxed">
            Every facility at Grand Horizon is designed to nourish the senses, provide absolute privacy, and elevate your coastal stay.
          </p>
        </div>

        {/* Grid and layout */}
        <div className="space-y-16">
          {amenitiesList.map((amenity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-12 items-center bg-navy-light/40 border border-white/5 p-6 md:p-12`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2 relative h-[350px] overflow-hidden border border-white/5">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{ backgroundImage: `url('${amenity.imageUrl}')` }}
                />
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 border border-white/10">
                    {amenity.icon}
                  </div>
                  <div>
                    <span className="text-accent text-xs font-semibold tracking-widest uppercase block">
                      {amenity.subtitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold font-serif text-white uppercase mt-0.5">
                      {amenity.title}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed font-sans">
                  {amenity.description}
                </p>

                <div className="flex items-center justify-between border-t border-b border-white/5 py-4 text-xs font-semibold tracking-widest text-gray-300">
                  <span>OPERATING HOURS:</span>
                  <span className="text-accent">{amenity.hours}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold tracking-widest text-white block mb-3">KEY HIGHLIGHTS:</span>
                  <div className="flex flex-wrap gap-2">
                    {amenity.features.map((feat, fidx) => (
                      <span
                        key={fidx}
                        className="px-3 py-1 bg-white/5 border border-white/5 text-gray-400 text-[10px] tracking-widest uppercase font-semibold"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
