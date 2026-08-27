"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Compass, Filter, Sparkles, RefreshCcw } from "lucide-react";
import RoomCard, { RoomData } from "../../components/RoomCard";

function RoomsListContent() {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guestsParam = searchParams.get("guests");

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [capacity, setCapacity] = useState<string>("all");
  const [bedType, setBedType] = useState<string>("all");

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        let url = `${apiBase}/rooms`;
        
        // If dates are provided, search availability
        if (checkIn && checkOut) {
          url = `${apiBase}/rooms/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestsParam || 1}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch room availability.");
        }
        const data = await res.json();
        setRooms(data);
        setFilteredRooms(data);
        
        // Determine max price dynamically
        if (data.length > 0) {
          const prices = data.map((r: RoomData) => typeof r.price === "string" ? parseFloat(r.price) : r.price);
          const highestPrice = Math.max(...prices);
          setMaxPrice(highestPrice + 50);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong loading rooms.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [checkIn, checkOut, guestsParam]);

  // Apply filters whenever filters state or room list changes
  useEffect(() => {
    let result = [...rooms];

    // Filter by price
    result = result.filter((room) => {
      const price = typeof room.price === "string" ? parseFloat(room.price) : room.price;
      return price <= maxPrice;
    });

    // Filter by capacity
    if (capacity !== "all") {
      const capLimit = parseInt(capacity);
      result = result.filter((room) => room.capacity >= capLimit);
    }

    // Filter by bed type
    if (bedType !== "all") {
      result = result.filter((room) => room.bedType.toLowerCase() === bedType.toLowerCase());
    }

    setFilteredRooms(result);
  }, [maxPrice, capacity, bedType, rooms]);

  const resetFilters = () => {
    setCapacity("all");
    setBedType("all");
    if (rooms.length > 0) {
      const prices = rooms.map((r) => typeof r.price === "string" ? parseFloat(r.price) : r.price);
      setMaxPrice(Math.max(...prices) + 50);
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">Accommodations</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 uppercase">
          {checkIn && checkOut ? "Available Suites" : "Villas & Suites"}
        </h1>
        {checkIn && checkOut && (
          <p className="text-xs text-accent font-semibold tracking-widest uppercase border border-accent/20 px-4 py-2 inline-block bg-white/5 font-sans">
            STAY PERIOD: {checkIn} TO {checkOut} ({guestsParam} GUESTS)
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Filter Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-8 glass-card p-6 md:p-8 h-fit border border-white/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2 font-sans">
              <Filter className="w-4 h-4 text-accent" />
              <span>Filter Search</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] tracking-widest font-semibold text-accent hover:text-white uppercase transition-colors flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Filter */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400 tracking-wider">
              <span>MAX PRICE:</span>
              <span className="text-accent">${maxPrice.toLocaleString()} / night</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Capacity Filter */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-400 tracking-wider block">CAPACITY</span>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-navy-deep border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-semibold tracking-wider rounded-none"
            >
              <option value="all">Any Guest Count</option>
              <option value="1">1 Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests</option>
              <option value="5">5+ Guests</option>
              <option value="6">6+ Guests</option>
            </select>
          </div>

          {/* Bed Type Filter */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-400 tracking-wider block">BED TYPE</span>
            <select
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              className="w-full bg-navy-deep border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-semibold tracking-wider rounded-none"
            >
              <option value="all">Any Bed Configuration</option>
              <option value="king">King Bed</option>
              <option value="queen">Queen Bed</option>
              <option value="double">Double Bed</option>
              <option value="twin">Twin Bed</option>
            </select>
          </div>
        </aside>

        {/* Right Side: Rooms Grid */}
        <main className="w-full lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 4].map((idx) => (
                <div key={idx} className="glass-card h-[480px] border border-white/5 animate-pulse flex flex-col justify-end p-6 space-y-4">
                  <div className="h-6 w-32 bg-white/10" />
                  <div className="h-8 w-64 bg-white/10" />
                  <div className="h-4 w-full bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-rose-500/20 bg-rose-500/5 text-rose-400 p-8">
              <p className="text-sm font-semibold tracking-wider">{error}</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-16 border border-white/10 bg-white/5 text-gray-400 p-8">
              <p className="text-sm font-semibold tracking-wider">No luxury suites match your active filter selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default function RoomsPage() {
  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Wrap content in Suspense since it accesses useSearchParams */}
      <Suspense fallback={
        <div className="container mx-auto px-6 py-24 text-center text-gray-400">
          <p className="animate-pulse">Loading suite reservations...</p>
        </div>
      }>
        <RoomsListContent />
      </Suspense>
    </div>
  );
}
