"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Compass, CheckCircle2, Calendar, FileText, ChevronRight } from "lucide-react";

interface BookingDetails {
  id: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  status: string;
  room: {
    name: string;
  };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/bookings/${bookingId}`);
        if (!res.ok) {
          throw new Error("Failed to load reservation registry details.");
        }
        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message || "An error occurred retrieving reservation.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="text-center space-y-4">
        <Compass className="w-12 h-12 text-accent animate-spin mx-auto" />
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">Verifying Reservation Registry...</p>
      </div>
    );
  }

  if (error || !bookingId) {
    return (
      <div className="glass-card max-w-lg p-8 text-center border border-white/5 bg-navy-light/10 space-y-6 mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-white uppercase">Verification Failed</h2>
        <p className="text-gray-400 text-sm">
          {error || "No reservation ID reference was provided. Please complete booking checkout."}
        </p>
        <Link href="/" className="inline-block pt-2">
          <button className="px-6 py-2.5 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none">
            RETURN TO HOMEPAGE
          </button>
        </Link>
      </div>
    );
  }

  const formattedAmount = booking
    ? parseFloat(booking.totalAmount).toLocaleString()
    : "0";

  return (
    <div className="max-w-2xl mx-auto glass-card border border-accent/20 bg-navy-light/20 p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
      
      {/* Top ambient gold accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-gold" />
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-sans">RESERVATION CONFIRMED</span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif uppercase tracking-wide text-white">Your Horizon Awaits</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto font-sans leading-relaxed">
          Thank you for choosing The Grand Horizon. A digital receipt has been transmitted to your email. Our concierge desk will contact you shortly.
        </p>
      </div>

      {/* Booking reference detail */}
      <div className="bg-navy-deep/80 border border-white/5 p-6 text-left space-y-4 font-sans text-xs tracking-wider">
        <div className="flex justify-between border-b border-white/5 pb-3">
          <span className="text-gray-400 font-semibold">BOOKING REFERENCE:</span>
          <span className="text-accent font-bold font-mono uppercase">{bookingId}</span>
        </div>

        {booking && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">GUEST:</span>
              <span className="text-white font-bold">{booking.guestName.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">SUITE VILLA:</span>
              <span className="text-white font-bold uppercase">{booking.room?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">STAY DURATION:</span>
              <span className="text-white font-bold">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold">
              <span className="text-white">TOTAL CHARGED:</span>
              <span className="text-accent">₹{formattedAmount}</span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link href="/">
          <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-semibold text-xs tracking-widest rounded-none hover:border-white transition-colors w-48">
            RETURN HOME
          </button>
        </Link>
        <Link href="/rooms">
          <button className="px-8 py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none w-48 flex items-center justify-center gap-1 hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow">
            <span>EXPLORE SUITES</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

    </div>
  );
}

// Wrapper with alert icon definition just in case
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="bg-navy-deep min-h-screen text-white pt-24 pb-24 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-navy-deep via-navy-light/10 to-accent/5 pointer-events-none" />
      
      <Suspense fallback={
        <div className="text-center py-24 text-gray-400">
          <p className="animate-pulse">Loading booking summary details...</p>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
