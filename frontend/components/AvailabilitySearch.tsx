"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Search } from "lucide-react";

export default function AvailabilitySearch() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full glass-panel border border-accent/20 p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
    >
      {/* Check In */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-widest text-accent uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>CHECK-IN DATE</span>
        </label>
        <input
          type="date"
          required
          min={getTodayDateString()}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent text-sm rounded-none"
        />
      </div>

      {/* Check Out */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-widest text-accent uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>CHECK-OUT DATE</span>
        </label>
        <input
          type="date"
          required
          min={checkIn || getTodayDateString()}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent text-sm rounded-none"
        />
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-widest text-accent uppercase flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          <span>GUESTS</span>
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full bg-navy-deep border border-white/10 px-4 py-[13px] text-white focus:outline-none focus:border-accent text-sm rounded-none"
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
          <option value="5">5+ Guests</option>
        </select>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full py-[13px] bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 rounded-none flex items-center justify-center gap-2 gold-border-glow"
        >
          <span>SEARCH AVAILABILITY</span>
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
