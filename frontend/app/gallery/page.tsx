"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Eye, X } from "lucide-react";

interface GalleryItem {
  id: number;
  category: "suites" | "dining" | "wellness" | "beachfront";
  title: string;
  url: string;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    // 1. SUITES (6 Images)
    {
      id: 1,
      category: "suites",
      title: "The Presidential Horizon Penthouse",
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600",
    },
    {
      id: 2,
      category: "suites",
      title: "Royal Ocean Terrace Villa",
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
    },
    {
      id: 3,
      category: "suites",
      title: "Sapphire Ocean Bed Salon",
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600",
    },
    {
      id: 4,
      category: "suites",
      title: "Grand Vista Family Living Room",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600",
    },
    {
      id: 5,
      category: "suites",
      title: "Horizon Master Bed Suite",
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600",
    },
    {
      id: 6,
      category: "suites",
      title: "Coastal Zen Garden Villa Bedroom",
      url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600",
    },

    // 2. DINING (6 Images)
    {
      id: 7,
      category: "dining",
      title: "L'Orizzonte Michelin Dining Room",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
    },
    {
      id: 8,
      category: "dining",
      title: "Sunset Sommelier Cellar Bar",
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600",
    },
    {
      id: 9,
      category: "dining",
      title: "Beachfront Champagne Terrace",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
    },
    {
      id: 10,
      category: "dining",
      title: "Sunrise Organic Coastal Bistro",
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600",
    },
    {
      id: 11,
      category: "dining",
      title: "The Ocean Grill Sunset Lounge",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600",
    },
    {
      id: 12,
      category: "dining",
      title: "Private Ocean Villa Dinner Setting",
      url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=600",
    },

    // 3. WELLNESS (6 Images)
    {
      id: 13,
      category: "wellness",
      title: "Zen Thermal Pool & Mineral Springs",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    },
    {
      id: 14,
      category: "wellness",
      title: "Malibu Ocean Yoga Deck",
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600",
    },
    {
      id: 15,
      category: "wellness",
      title: "Dry Cedarwood Thermal Sauna",
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
    },
    {
      id: 16,
      category: "wellness",
      title: "Organic Healing Facial Therapy Suite",
      url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600",
    },
    {
      id: 17,
      category: "wellness",
      title: "Sunset Ocean Massage Pavilion",
      url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600",
    },
    {
      id: 18,
      category: "wellness",
      title: "Mineral Water Healing Bathhouse",
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600",
    },

    // 4. BEACHFRONT (6 Images)
    {
      id: 19,
      category: "beachfront",
      title: "Private Coastal Sunset Pier",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    },
    {
      id: 20,
      category: "beachfront",
      title: "Bespoke Beach Club Cabana Lounge",
      url: "https://images.unsplash.com/photo-1473116763269-255415f9ff6a?q=80&w=600",
    },
    {
      id: 21,
      category: "beachfront",
      title: "Sunset Oceanfront Firepit Lounge",
      url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600",
    },
    {
      id: 22,
      category: "beachfront",
      title: "Sapphire Coast Cliffside Boardwalk",
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600",
    },
    {
      id: 23,
      category: "beachfront",
      title: "Private Beach Sun Lounges & Chairs",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
    },
    {
      id: 24,
      category: "beachfront",
      title: "Malibu Surf Horizon Pavilion",
      url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600",
    },
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const categories = [
    { value: "all", label: "ALL SCENES" },
    { value: "suites", label: "SUITES" },
    { value: "dining", label: "DINING" },
    { value: "wellness", label: "WELLNESS" },
    { value: "beachfront", label: "BEACHFRONT" },
  ];

  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-accent" />
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Gallery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 uppercase">
            A Canvas of Coastal Elegance
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto font-sans">
            Explore our curated moments of architectural beauty, gourmet culinary craft, and ocean relaxation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-6 py-2.5 text-xs font-semibold tracking-widest transition-all duration-300 relative border ${
                activeFilter === cat.value
                  ? "border-accent text-accent"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {cat.label}
              {activeFilter === cat.value && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-accent/5 -z-10"
                />
              )}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedImage(item)}
                className="group relative h-80 bg-navy-light border border-white/5 overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.url}')` }}
                />
                
                {/* Elegant hover mask */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-accent mb-2" />
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-serif font-bold text-white tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Overlay */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-white hover:text-accent transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full h-[75vh] flex flex-col items-center justify-center"
              >
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${selectedImage.url}')` }}
                />
                <div className="w-full text-center mt-4 px-4">
                  <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-white font-serif font-bold text-lg md:text-2xl mt-1">
                    {selectedImage.title}
                  </h2>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
