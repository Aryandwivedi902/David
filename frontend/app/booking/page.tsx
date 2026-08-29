"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Compass, CheckCircle2, AlertCircle, Info, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface RoomOption {
  id: string;
  name: string;
  price: string;
  capacity: number;
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();

  // Parse query params
  const paramRoomId = searchParams.get("room") || "";
  const paramCheckIn = searchParams.get("checkIn") || "";
  const paramCheckOut = searchParams.get("checkOut") || "";
  const paramGuests = searchParams.get("guests") || "1";

  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  
  // Form fields state
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState(paramGuests);
  const [checkInDate, setCheckInDate] = useState(paramCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(paramCheckOut);
  const [specialRequest, setSpecialRequest] = useState("");

  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [status, setStatus] = useState<{
    type: "idle" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"" | "upi" | "bank">("");
  const [upiId, setUpiId] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentHighlightError, setPaymentHighlightError] = useState(false);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load rooms for selection dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      setRoomsLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/rooms`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);

          // Find pre-selected room from param
          if (paramRoomId) {
            const match = data.find((r: RoomOption) => r.id === paramRoomId);
            if (match) setSelectedRoom(match);
          } else if (data.length > 0) {
            setSelectedRoom(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load rooms:", err);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, [paramRoomId]);

  // Handle manual room selection change
  const handleRoomChange = (roomId: string) => {
    const match = rooms.find((r) => r.id === roomId) || null;
    setSelectedRoom(match);
  };

  // Pricing calculations
  const [nights, setNights] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoom) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalCost(diffDays * parseFloat(selectedRoom.price));
      } else {
        setNights(0);
        setTotalCost(0);
      }
    } else {
      setNights(0);
      setTotalCost(0);
    }
  }, [checkInDate, checkOutDate, selectedRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    // Client-side date check
    if (nights <= 0) {
      setStatus({ type: "error", message: "Check-out date must be after check-in date." });
      return;
    }

    if (!selectedRoom) {
      setStatus({ type: "error", message: "Please select an available room." });
      return;
    }

    // Payment validation
    if (!paymentMethod) {
      setPaymentHighlightError(true);
      setStatus({ type: "error", message: "Please select a payment method (UPI or Direct Bank Transfer)." });
      return;
    }

    if (!paymentVerified) {
      setPaymentHighlightError(true);
      setStatus({ type: "error", message: "Please complete your payment of ₹" + totalCost.toLocaleString() + " using the Pay button." });
      return;
    }

    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${apiBase}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          roomId: selectedRoom.id,
          userId: user?.id || null,
          guestName,
          email,
          phone,
          guests: parseInt(guestsCount),
          checkIn: checkInDate,
          checkOut: checkOutDate,
          specialRequest,
          paymentMethod,
          paymentReference,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to booking confirmation screen
        router.push(`/booking/confirmation?id=${data.id}`);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to finalize room reservation.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "A network error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-accent" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">Secure Booking</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 uppercase">
          Finalize Your Stay
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          Provide your details below to register your reservation at The Grand Horizon Resort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        
        {/* Left Side: Form Details (Columns: 2/3) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 glass-card p-8 md:p-12 border border-white/5 bg-navy-light/10">
          
          <h2 className="text-xl font-bold font-serif uppercase tracking-wider text-white border-b border-white/5 pb-4">
            Guest Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="E.g., Lord Montgomery"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g., monty@horizon.com"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none text-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Contact Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="E.g., +1 (310) 555-0100"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Preferred Suite</label>
              {roomsLoading ? (
                <div className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-xs text-gray-400 animate-pulse">
                  Querying accommodations...
                </div>
              ) : (
                <select
                  value={selectedRoom?.id || ""}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent text-sm rounded-none font-sans"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - ₹{parseFloat(r.price).toLocaleString()}/night
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold font-serif uppercase tracking-wider text-white border-b border-white/5 pb-4 pt-4">
            Reservation Period
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Check-In</label>
              <input
                type="date"
                required
                min={getTodayDateString()}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Check-Out</label>
              <input
                type="date"
                required
                min={checkInDate || getTodayDateString()}
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase font-sans">GUESTS</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-xs focus:outline-none focus:border-accent rounded-none font-sans"
              >
                {selectedRoom ? (
                  Array.from({ length: selectedRoom.capacity }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))
                ) : (
                  <option value="1">1 Guest</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Special Request (Optional)</label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              rows={4}
              placeholder="E.g., Private Sommelier champagne setup in room upon arrival, late check-out, specific allergy requirements..."
              className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent text-sm rounded-none resize-none transition-colors"
            />
          </div>

          {/* Payment Section */}
          <h2 className="text-xl font-bold font-serif uppercase tracking-wider text-white border-b border-white/5 pb-4 pt-4">
            Payment Details
          </h2>

          <div 
            className={`p-6 border transition-all duration-300 ${
              paymentHighlightError 
                ? "border-rose-500 bg-rose-500/5 animate-pulse" 
                : "border-white/10 bg-navy-deep/40"
            }`}
          >
            <div className="space-y-4">
              <label className="text-xs font-semibold tracking-wider text-gray-300 uppercase block">
                Select Payment Method
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("upi");
                    setPaymentHighlightError(false);
                  }}
                  className={`py-3 text-xs font-bold tracking-widest uppercase transition-all border rounded-none ${
                    paymentMethod === "upi"
                      ? "bg-gradient-gold text-navy-deep border-accent"
                      : "bg-navy-deep text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  UPI (GPay / PhonePe / Paytm)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("bank");
                    setPaymentHighlightError(false);
                  }}
                  className={`py-3 text-xs font-bold tracking-widest uppercase transition-all border rounded-none ${
                    paymentMethod === "bank"
                      ? "bg-gradient-gold text-navy-deep border-accent"
                      : "bg-navy-deep text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  Direct Bank Transfer
                </button>
              </div>

              {/* UPI Fields */}
              {paymentMethod === "upi" && (
                <div className="space-y-4 pt-3 border-t border-white/5">
                  <div className="flex flex-col items-center justify-center bg-navy-deep/60 p-4 border border-white/5 space-y-4">
                    <span className="text-[10px] font-bold text-accent tracking-widest uppercase">
                      Scan to Pay (Aryan Dwivedi)
                    </span>
                    <div className="relative w-48 h-80 border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="/upi-qr.jpg" 
                        alt="UPI Payment QR Code" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-white font-mono font-bold tracking-wide">
                        UPI ID: 9368945883@fam
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                        Scan with GPay, PhonePe, Paytm, or any UPI app
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                      Your UPI ID (For Verification)
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@upi"
                      className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent rounded-none"
                    />
                  </div>
                </div>
              )}

              {/* Bank Fields */}
              {paymentMethod === "bank" && (
                <div className="space-y-4 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                      Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      placeholder="e.g. 50100412345678"
                      className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold text-gray-400 tracking-widest uppercase font-sans">
                      IFSC CODE
                    </label>
                    <input
                      type="text"
                      required
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      placeholder="e.g. HDFC0001234"
                      className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent rounded-none font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Simulated Pay Trigger */}
              {paymentMethod && !paymentVerified && (
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={paymentLoading || (paymentMethod === "upi" ? !upiId : (!accountNo || !ifsc))}
                    onClick={async () => {
                      setPaymentLoading(true);
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      const fakeRef = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;
                      setPaymentReference(fakeRef);
                      setPaymentVerified(true);
                      setPaymentLoading(false);
                    }}
                    className="w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 uppercase flex items-center justify-center gap-2 rounded-none"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        PROCESSING TRANSACTION...
                      </>
                    ) : (
                      `PAY ₹${totalCost.toLocaleString()}`
                    )}
                  </button>
                </div>
              )}

              {/* Payment Success Confirmation Indicator */}
              {paymentVerified && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">Payment Verified Successfully</span>
                    <span className="text-[10px] text-gray-400">Ref ID: {paymentReference}</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Submission status feedback */}
          {status.type === "error" && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none transition-all duration-500 flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-white hover:border-white"
            }`}
          >
            {loading ? "TRANSMITTING RESERVATION..." : "CONFIRM SECURE RESERVATION"}
          </button>
        </form>

        {/* Right Side: Stay Summary (Column: 1/3) */}
        <aside className="w-full glass-card p-8 border border-accent/20 bg-navy-light/30 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase font-sans border-b border-white/5 pb-4">
            Reservation Summary
          </h3>

          {selectedRoom ? (
            <div className="space-y-4 text-xs tracking-wider font-sans">
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">SUITE:</span>
                <div className="text-sm font-serif font-bold text-white uppercase mt-0.5">{selectedRoom.name}</div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">NIGHTLY RATE:</span>
                <div className="text-sm text-accent font-semibold mt-0.5">₹{parseFloat(selectedRoom.price).toLocaleString()}</div>
              </div>

              {nights > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-gray-400">
                    <span>STAY DURATION:</span>
                    <span>{nights} {nights === 1 ? "Night" : "Nights"}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>GUESTS:</span>
                    <span>{guestsCount}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm border-t border-white/5 pt-3">
                    <span>TOTAL AMOUNT:</span>
                    <span className="text-accent">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Please choose a suite to preview stay totals.</p>
          )}

          <div className="bg-white/5 border border-white/5 p-4 flex gap-3 text-[10px] leading-relaxed text-gray-400">
            <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p>
              Free cancellation up to 48 hours prior to arrival. Our concierge team will reach out via phone to verify stay specifics.
            </p>
          </div>
        </aside>

      </div>

    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      
      <Suspense fallback={
        <div className="container mx-auto px-6 py-24 text-center text-gray-400">
          <p className="animate-pulse">Preparing reservation registry...</p>
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
