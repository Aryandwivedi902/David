"use client";

import React, { useState } from "react";
import { Calendar, Users, Phone, Mail, User } from "lucide-react";

interface BookingFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  maxGuests?: number;
}

export default function BookingForm({ onSubmit, loading, maxGuests = 4 }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [request, setRequest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      guestName: name,
      email,
      phone,
      guests: parseInt(guests),
      checkIn,
      checkOut,
      specialRequest: request,
    });
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs tracking-wider text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Lady Cynthia"
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cynthia@estates.com"
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Number</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (310) 555-0100"
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>Guests</span>
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent font-sans"
          >
            {Array.from({ length: maxGuests }).map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i === 0 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            required
            min={getTodayDateString()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-gray-400 font-bold uppercase text-[9px] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Check-Out</span>
          </label>
          <input
            type="date"
            required
            min={checkIn || getTodayDateString()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-gray-400 font-bold uppercase text-[9px]">Special Instructions</label>
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          rows={3}
          placeholder="E.g., dietary, private security coordinate, specific champagne selection..."
          className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent resize-none font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow"
      >
        {loading ? "TRANSMITTING DATA..." : "COMMIT RESERVATION"}
      </button>
    </form>
  );
}
