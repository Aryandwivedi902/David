"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { getUserBookings, cancelBooking } from "../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, IndianRupee, Compass, AlertCircle, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";

interface BookingRecord {
  id: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  guests: number;
  status: string;
  specialRequest?: string | null;
  room: {
    name: string;
    imageUrl: string;
  };
}

export default function MyBookingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(token!);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    setActionLoadingId(id);
    try {
      await cancelBooking(id);
      // Refresh list
      fetchBookings();
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (authLoading || (loading && bookings.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center relative z-10">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold tracking-wider uppercase">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-semibold tracking-wider uppercase">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 border border-gray-500/30 text-gray-400 text-[10px] font-semibold tracking-wider uppercase">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-white tracking-wider mb-2">
          MY RESERVATIONS
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase">
          Welcome back, {user.name}. Manage and review your stay history.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border-l-2 border-red-500 text-xs text-red-300 tracking-wide">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 border border-white/5 bg-navy-light/20 backdrop-blur-md">
          <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-serif text-white mb-2">No Bookings Found</h2>
          <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
            You do not have any reservations yet.
          </p>
          <Link href="/rooms">
            <button className="px-8 py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500">
              EXPLORE OUR SUITES
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row border border-white/10 bg-navy-light/30 backdrop-blur-md overflow-hidden"
            >
              {/* Room Image */}
              <div className="relative w-full md:w-80 h-48 md:h-auto min-h-[12rem]">
                <Image
                  src={booking.room.imageUrl}
                  alt={booking.room.name}
                  fill
                  sizes="(max-w-768px) 100vw, 320px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Booking Info */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-xl font-serif text-white">
                      {booking.room.name}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-gray-300 uppercase tracking-wider mb-6">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      <div>
                        <span className="block text-[9px] text-gray-500 font-semibold mb-0.5">CHECK IN</span>
                        {formatDate(booking.checkIn)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      <div>
                        <span className="block text-[9px] text-gray-500 font-semibold mb-0.5">CHECK OUT</span>
                        {formatDate(booking.checkOut)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-accent" />
                      <div>
                        <span className="block text-[9px] text-gray-500 font-semibold mb-0.5">GUESTS</span>
                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                      </div>
                    </div>
                  </div>

                  {booking.specialRequest && (
                    <div className="mb-6 p-3 bg-white/5 border border-white/5 text-[11px] text-gray-400 italic">
                      <span className="font-semibold text-accent not-italic mr-1">Special request:</span>
                      &ldquo;{booking.specialRequest}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 mt-4">
                  <div className="flex items-center text-white">
                    <IndianRupee className="w-4 h-4 text-accent mr-0.5" />
                    <span className="text-xl font-serif">
                      {Number(booking.totalAmount).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 tracking-wider ml-1.5 uppercase">
                      TOTAL PAID
                    </span>
                  </div>

                  {(booking.status.toLowerCase() === "pending" || booking.status.toLowerCase() === "confirmed") && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={actionLoadingId === booking.id}
                      className="px-6 py-2 border border-rose-500/40 text-rose-400 font-semibold text-[10px] tracking-widest uppercase hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoadingId === booking.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          CANCELLING...
                        </>
                      ) : (
                        "CANCEL RESERVATION"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
