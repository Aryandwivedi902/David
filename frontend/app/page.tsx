"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, MapPin, Phone, Mail, ArrowRight, Quote } from "lucide-react";
import AvailabilitySearch from "../components/AvailabilitySearch";
import RoomCard, { RoomData } from "../components/RoomCard";

// Dynamic import for 3D Hero to prevent SSR issues with Canvas
const Hero3D = dynamic(() => import("../components/Hero3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-navy-deep animate-pulse" />,
});

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState<RoomData[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/rooms`);
        if (res.ok) {
          const data = await res.json();
          // Take first 3 rooms for home featured section
          setFeaturedRooms(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load featured rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const testimonials = [
    {
      quote: "The private ocean villa at Grand Horizon is a sanctuary beyond words. Waking up to the sunrise over Malibu while our butler prepared breakfast was unforgettable.",
      author: "Lord Charles Sterling",
      role: "London, UK",
    },
    {
      quote: "Every culinary experience at L'Orizzonte was masterpiece. The combination of Michelin-level craft and the raw California coast creates a magic you must witness.",
      author: "Helena Rostova",
      role: "Travel Journalist",
    },
  ];

  return (
    <div className="bg-navy-deep text-white min-h-screen relative overflow-hidden">
      
      {/* 1. HERO SECTION WITH 3D COMPONENT */}
      <section className="relative w-full h-[95vh] md:h-screen flex items-center justify-center pt-20">
        <Hero3D />
        
        {/* Dark mesh gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-black/30 pointer-events-none" />

        {/* Hero content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              PREMIUM LUXURY HOSPITALITY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold font-serif mb-6 leading-tight uppercase max-w-5xl tracking-wide"
          >
            Experience Luxury, <br />
            <span className="text-transparent bg-clip-text bg-gradient-gold font-serif gold-glow">
              Your Way.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-gray-300 text-sm md:text-lg max-w-xl mb-10 font-sans tracking-wide leading-relaxed"
          >
            Stay in absolute comfort. Discover exceptional personalized service, fine coastal dining, and majestic ocean horizons.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link href="/rooms">
              <button className="px-8 py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow w-48">
                EXPLORE SUITES
              </button>
            </Link>
            <Link href="/booking">
              <button className="px-8 py-3 bg-transparent border border-white/30 text-white font-semibold text-xs tracking-widest rounded-none hover:bg-white hover:text-navy-deep transition-all duration-500 w-48">
                BOOK YOUR STAY
              </button>
            </Link>
          </motion.div>

          {/* Availability search block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full max-w-5xl"
          >
            <AvailabilitySearch />
          </motion.div>
        </div>
      </section>

      {/* 2. SANCTUARY INTRO SECTION */}
      <section className="py-28 relative border-b border-white/5">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] w-full border border-white/10 overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540548148-681c4e469623?q=80&w=1200')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="text-accent text-xs font-semibold tracking-widest uppercase block mb-1">Architectural Sanctuary</span>
                <span className="text-white font-serif text-2xl font-bold">Resort Ocean Lobby</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold tracking-widest text-accent uppercase">THE SANCTUARY</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif uppercase leading-tight text-white">
                A Coastal Haven Designed for Tranquility
              </h2>
              <div className="h-[2px] w-20 bg-accent" />
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                Elevated on a secluded cliffside overlooking Malibu's beautiful surf, The Grand Horizon Resort & Spa merges modern minimalism with European elegance. We provide our guests with an intimate escape featuring private infinity pools, wellness therapies, and tailored somatic services.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed font-sans">
                Each room is a custom-curated villa containing sweeping floor-to-ceiling vistas, premium organic amenities, and private lounge decks. Walk our coastal piers, indulge in Michelin-starred bistro dining, or let our sommelier select a fine reserve vintage to suit your evening.
              </p>
              <div className="pt-4">
                <Link href="/about">
                  <button className="px-6 py-2.5 bg-transparent border border-accent text-accent hover:bg-accent hover:text-navy-deep font-semibold text-xs tracking-widest transition-all duration-300 rounded-none inline-flex items-center gap-2">
                    <span>DISCOVER HERITAGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS SECTION */}
      <section className="py-28 bg-navy-dark/40 border-b border-white/5 relative">
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold tracking-widest text-accent uppercase">LUXURY ACCOMMODATIONS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif uppercase text-white">
                Our Signature Suites
              </h2>
            </div>
            <Link href="/rooms">
              <button className="text-xs font-bold tracking-widest text-accent hover:text-white uppercase transition-colors flex items-center gap-2">
                <span>VIEW ALL ACCOMMODATIONS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Rooms Grid */}
          {loadingRooms ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="glass-card h-[500px] border border-white/5 rounded-none animate-pulse flex flex-col justify-end p-6 space-y-4">
                  <div className="h-6 w-32 bg-white/10" />
                  <div className="h-8 w-64 bg-white/10" />
                  <div className="h-4 w-full bg-white/10" />
                </div>
              ))}
            </div>
          ) : featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-white/10 bg-white/5">
              <p className="text-gray-400 text-sm">No suites currently loaded. Please run the database seeds.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-28 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-accent uppercase block mb-3">GUEST CHRONICLES</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif uppercase">Whispers of Satisfaction</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="glass-card p-10 relative flex flex-col justify-between rounded-none border border-white/5"
              >
                <Quote className="w-10 h-10 text-accent/20 absolute top-6 right-6" />
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 italic font-sans">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="text-sm font-bold tracking-widest text-accent uppercase font-sans">
                    {t.author}
                  </h4>
                  <span className="text-xs text-gray-500">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LOCATION / CTA SECTION */}
      <section className="py-24 bg-navy-dark border-t border-white/5 relative">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl space-y-8 relative z-10">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase block">YOUR COASTAL ESCAPE AWAITS</span>
          <h2 className="text-4xl md:text-7xl font-bold font-serif uppercase leading-tight text-white">
            Set Your Coordinates <br />
            To Comfort.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-sans">
            Reserve your private penthouse villa or request custom travel packages from our reservations team.
          </p>
          <div className="pt-4">
            <Link href="/booking">
              <button className="px-10 py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow w-56">
                SECURE BOOKING
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
