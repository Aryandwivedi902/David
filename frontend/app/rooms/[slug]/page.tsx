"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Users, Maximize2, Bed, Calendar, Check, Info, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface RoomDetailsData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  capacity: number;
  bedType: string;
  size: number;
  imageUrl: string;
  amenities: { id: string; amenity: string }[];
}

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [room, setRoom] = useState<RoomDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reservation selector states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [nightsCount, setNightsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/rooms/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("The requested luxury suite could not be found.");
          }
          throw new Error("Failed to load suite details.");
        }
        const data = await res.json();
        setRoom(data);
      } catch (err: any) {
        setError(err.message || "An error occurred fetching room details.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchRoomDetails();
  }, [slug]);

  // Calculate nights and price when dates change
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNightsCount(diffDays);
        setTotalPrice(diffDays * parseFloat(room.price));
      } else {
        setNightsCount(0);
        setTotalPrice(0);
      }
    } else {
      setNightsCount(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, room]);

  const handleBookRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    if (checkIn && checkOut && nightsCount > 0) {
      router.push(`/booking?room=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    } else {
      router.push(`/booking?room=${room.id}`);
    }
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="bg-navy-deep min-h-screen text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Compass className="w-12 h-12 text-accent animate-spin mx-auto" />
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">Loading Suite Specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="bg-navy-deep min-h-screen text-white flex items-center justify-center px-6">
        <div className="glass-card max-w-md p-8 text-center border border-rose-500/20 bg-rose-500/5 space-y-6">
          <Info className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-white uppercase">Reservation Error</h2>
          <p className="text-gray-400 text-sm">{error || "Suite configuration not loaded."}</p>
          <Link href="/rooms" className="inline-block pt-2">
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-white hover:border-white transition-colors rounded-none">
              RETURN TO ACCOMMODATIONS
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const roomPrice = parseFloat(room.price);

  return (
    <div className="bg-navy-deep min-h-screen text-white pt-10 pb-24 relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Back Link */}
        <Link href="/rooms" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-accent hover:text-white uppercase transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to suites</span>
        </Link>

        {/* Layout: Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Main Info (Left columns: 2/3) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Suite Large image */}
            <div className="relative h-[450px] w-full border border-white/10 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${room.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-6">
              <span className="text-accent text-xs font-semibold tracking-widest uppercase block">EXCLUSIVE PRIVATE VILLA</span>
              <h1 className="text-4xl md:text-5xl font-bold font-serif uppercase tracking-wide text-white">{room.name}</h1>
              
              <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-6 text-xs font-semibold tracking-widest text-gray-400 font-sans text-center">
                <div className="flex flex-col items-center gap-1.5 border-r border-white/5">
                  <Users className="w-5 h-5 text-accent" />
                  <span>UP TO {room.capacity} GUESTS</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 border-r border-white/5">
                  <Maximize2 className="w-5 h-5 text-accent" />
                  <span>{room.size} SQ METERS</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Bed className="w-5 h-5 text-accent" />
                  <span>{room.bedType.toUpperCase()} BED</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase font-sans">The Space</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-white uppercase font-sans">Included Suite Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-3 text-xs tracking-wide">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300 font-sans">{item.amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Checkout Calculator panel (Right column: 1/3) */}
          <aside className="w-full glass-card p-8 border border-accent/20 bg-navy-light/30">
            <div className="border-b border-white/5 pb-6 mb-6">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">NIGHTLY RATE</span>
              <div className="text-3xl font-bold text-accent font-serif mt-1">
                ₹{roomPrice.toLocaleString()} <span className="text-xs font-normal text-gray-400 font-sans">/ NIGHT</span>
              </div>
            </div>

            <form onSubmit={handleBookRedirect} className="space-y-6">
              {/* Check in date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">CHECK-IN</label>
                <input
                  type="date"
                  required
                  min={getTodayDateString()}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none"
                />
              </div>

              {/* Check out date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">CHECK-OUT</label>
                <input
                  type="date"
                  required
                  min={checkIn || getTodayDateString()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none"
                />
              </div>

              {/* Guest Count */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none font-sans"
                >
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time pricing display */}
              {nightsCount > 0 && (
                <div className="bg-white/5 border border-white/5 p-4 space-y-2 text-xs font-semibold tracking-wider font-sans">
                  <div className="flex justify-between text-gray-400">
                    <span>RATE PER NIGHT:</span>
                    <span>₹{roomPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>DURATION:</span>
                    <span>{nightsCount} {nightsCount === 1 ? "Night" : "Nights"}</span>
                  </div>
                  <div className="flex justify-between text-accent border-t border-white/5 pt-2 text-sm font-bold">
                    <span>ESTIMATED TOTAL:</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit redirect button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow"
              >
                {nightsCount > 0 ? "PROCEED TO BOOKING" : "BOOK INSTANTLY"}
              </button>
            </form>
          </aside>

        </div>

      </div>
    </div>
  );
}
