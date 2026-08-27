"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Compass, LayoutDashboard, CalendarDays, Hotel, MailOpen, LogOut,
  TrendingUp, CircleDot, User, Plus, Pencil, Trash2, Check, X, ShieldCheck
} from "lucide-react";
import {
  getAdminBookings, getAdminRooms, getAdminMessages, getAdminProfile,
  updateBookingStatus, createRoom, updateRoom, deleteRoom
} from "../../../lib/api";

type Tab = "overview" | "bookings" | "rooms" | "messages";

interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  status: string;
  specialRequest?: string;
  room: {
    name: string;
  };
}

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  capacity: number;
  bedType: string;
  size: number;
  imageUrl: string;
  amenities: { amenity: string }[];
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Administrator");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating/editing rooms
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    capacity: "",
    bedType: "King",
    size: "",
    imageUrl: "",
    amenities: "",
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Authenticate Admin and retrieve token
  useEffect(() => {
    const activeToken = localStorage.getItem("adminToken");
    const name = localStorage.getItem("adminName");
    if (!activeToken) {
      router.push("/admin/login");
      return;
    }
    setToken(activeToken);
    if (name) setAdminName(name);
  }, [router]);

  // Load Dashboard Data once token is set
  useEffect(() => {
    if (!token) return;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsData, roomsData, messagesData] = await Promise.all([
          getAdminBookings(token),
          getAdminRooms(token),
          getAdminMessages(token),
        ]);
        setBookings(bookingsData);
        setRooms(roomsData);
        setMessages(messagesData);
      } catch (err) {
        console.error("Failed to load dashboard parameters:", err);
        // If auth fails, reset token
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [token, router]);

  // Logout action
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  // Modify Booking Status (Confirm / Cancel)
  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    if (!token) return;
    try {
      const updated = await updateBookingStatus(token, id, nextStatus);
      // Update local state list
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Delete Room Action
  const handleDeleteRoom = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this luxury suite configuration?")) return;
    try {
      await deleteRoom(token, id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete room configuration.");
    }
  };

  // Open creation modal
  const openCreateModal = () => {
    setEditingRoomId(null);
    setRoomForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      capacity: "",
      bedType: "King",
      size: "",
      imageUrl: "",
      amenities: "",
    });
    setFormError("");
    setShowRoomModal(true);
  };

  // Open edit modal
  const openEditModal = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomForm({
      name: room.name,
      slug: room.slug,
      description: room.description,
      price: room.price,
      capacity: room.capacity.toString(),
      bedType: room.bedType,
      size: room.size.toString(),
      imageUrl: room.imageUrl,
      amenities: room.amenities.map((a) => a.amenity).join(", "),
    });
    setFormError("");
    setShowRoomModal(true);
  };

  // Submit Room form
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormError("");
    setFormLoading(true);

    const formattedData = {
      name: roomForm.name,
      slug: roomForm.slug,
      description: roomForm.description,
      price: parseFloat(roomForm.price),
      capacity: parseInt(roomForm.capacity),
      bedType: roomForm.bedType,
      size: parseInt(roomForm.size),
      imageUrl: roomForm.imageUrl,
      amenities: roomForm.amenities.split(",").map((s) => s.trim()).filter((s) => s !== ""),
    };

    try {
      if (editingRoomId) {
        const updated = await updateRoom(token, editingRoomId, formattedData);
        setRooms((prev) => prev.map((r) => (r.id === editingRoomId ? updated : r)));
      } else {
        const created = await createRoom(token, formattedData);
        setRooms((prev) => [...prev, created]);
      }
      setShowRoomModal(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to process room database entry.");
    } finally {
      setFormLoading(false);
    }
  };

  // Overview metrics calculations
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const activeRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

  return (
    <div className="bg-navy-deep min-h-screen text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-navy-dark border-r border-white/5 flex flex-col justify-between flex-shrink-0 p-6 md:h-screen sticky top-0">
        <div className="space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold tracking-widest text-white font-serif">
              GRAND<span className="text-accent font-sans text-xs font-semibold tracking-widest ml-1">HORIZON</span>
            </span>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-2 font-sans text-xs font-bold tracking-wider">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors text-left ${
                activeTab === "overview" ? "bg-accent/10 text-accent border-l-2 border-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>OVERVIEW</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors text-left ${
                activeTab === "bookings" ? "bg-accent/10 text-accent border-l-2 border-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>BOOKINGS</span>
            </button>
            <button
              onClick={() => setActiveTab("rooms")}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors text-left ${
                activeTab === "rooms" ? "bg-accent/10 text-accent border-l-2 border-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <Hotel className="w-4 h-4" />
              <span>SUITES</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors text-left ${
                activeTab === "messages" ? "bg-accent/10 text-accent border-l-2 border-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <MailOpen className="w-4 h-4" />
              <span>INQUIRIES</span>
            </button>
          </nav>
        </div>

        {/* Profile / Logout Section */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3 text-xs tracking-wider">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">{adminName}</div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Control</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold tracking-widest text-rose-400 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT SYSTEM</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        
        {/* Header bar */}
        <header className="flex justify-between items-center border-b border-white/5 pb-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-wide">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "bookings" && "Reservation Management"}
              {activeTab === "rooms" && "Suite Villa Inventory"}
              {activeTab === "messages" && "Customer Correspondence"}
            </h1>
            <span className="text-xs text-gray-400 font-sans mt-1 block">
              Manage your hotel suite allocations, booking validations, and customer enquiries.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-widest text-accent uppercase border border-accent/20 px-4 py-2 bg-accent/5">
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>SECURE privileged portal</span>
          </div>
        </header>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-20">
            <Compass className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold tracking-widest text-accent uppercase animate-pulse">Syncing Database Ledgers...</p>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW SCREEN */}
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue Card */}
                  <div className="glass-card p-6 border border-white/5 text-left rounded-none">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ESTIMATED REVENUE</span>
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-serif text-accent">${activeRevenue.toLocaleString()}</div>
                    <span className="text-[9px] text-gray-500 font-semibold tracking-wide block mt-1">From confirmed reservations</span>
                  </div>

                  {/* Total Bookings Card */}
                  <div className="glass-card p-6 border border-white/5 text-left rounded-none">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">TOTAL RESERVATIONS</span>
                      <CalendarDays className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-serif text-white">{totalBookings}</div>
                    <span className="text-[9px] text-gray-500 font-semibold tracking-wide block mt-1">All bookings in database</span>
                  </div>

                  {/* Confirmed Card */}
                  <div className="glass-card p-6 border border-white/5 text-left rounded-none">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">CONFIRMED STAYS</span>
                      <CircleDot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-serif text-emerald-400">{confirmedBookings}</div>
                    <span className="text-[9px] text-gray-500 font-semibold tracking-wide block mt-1">Guaranteed check-ins</span>
                  </div>

                  {/* Pending Card */}
                  <div className="glass-card p-6 border border-white/5 text-left rounded-none">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">PENDING CHECKS</span>
                      <CircleDot className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-serif text-amber-400">{pendingBookings}</div>
                    <span className="text-[9px] text-gray-500 font-semibold tracking-wide block mt-1">Awaiting verification</span>
                  </div>
                </div>

                {/* Recent Bookings Ledger Table preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest text-white uppercase font-sans">Recent Reservations</h3>
                  <div className="overflow-x-auto border border-white/5 bg-navy-dark/40">
                    <table className="w-full text-left font-sans text-xs tracking-wider border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-gray-400 uppercase font-semibold text-[9px]">
                          <th className="p-4">Guest</th>
                          <th className="p-4">Suite</th>
                          <th className="p-4">Stay Dates</th>
                          <th className="p-4">Charged</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 font-semibold text-white">{b.guestName}</td>
                            <td className="p-4 uppercase">{b.room?.name}</td>
                            <td className="p-4">{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</td>
                            <td className="p-4 text-accent font-semibold">${parseFloat(b.totalAmount).toLocaleString()}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 text-[9px] uppercase font-bold ${
                                b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                b.status === "cancelled" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS CONTROL TABLE */}
            {activeTab === "bookings" && (
              <div className="overflow-x-auto border border-white/5 bg-navy-dark/40">
                <table className="w-full text-left font-sans text-xs tracking-wider border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 uppercase font-semibold text-[9px]">
                      <th className="p-4">Guest</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Suite Villa</th>
                      <th className="p-4">Stay Period</th>
                      <th className="p-4">Sum Charged</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-white">
                          <div>{b.guestName}</div>
                          <div className="text-[9px] text-gray-500 font-mono mt-0.5">{b.id.substring(0, 8).toUpperCase()}...</div>
                        </td>
                        <td className="p-4 text-gray-300">
                          <div>{b.email}</div>
                          <div>{b.phone}</div>
                        </td>
                        <td className="p-4 uppercase font-semibold">{b.room?.name}</td>
                        <td className="p-4">
                          <div>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</div>
                          <span className="text-[9px] text-gray-500">{b.guests} Guests</span>
                        </td>
                        <td className="p-4 text-accent font-semibold">${parseFloat(b.totalAmount).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[9px] uppercase font-bold ${
                            b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            b.status === "cancelled" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {b.status === "pending" && (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleUpdateStatus(b.id, "confirmed")}
                                className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all"
                                title="Confirm Reservation"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, "cancelled")}
                                className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black transition-all"
                                title="Cancel Reservation"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "cancelled")}
                              className="px-2 py-1 text-[9px] border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-black transition-all"
                            >
                              CANCEL STAY
                            </button>
                          )}
                          {b.status === "cancelled" && (
                            <span className="text-[10px] text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. SUITES INVENTORY CONTROL */}
            {activeTab === "rooms" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-2.5 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 flex items-center gap-2 rounded-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD SUITE CONFIG</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-white/5 bg-navy-dark/40">
                  <table className="w-full text-left font-sans text-xs tracking-wider border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-400 uppercase font-semibold text-[9px]">
                        <th className="p-4">Suite Details</th>
                        <th className="p-4">Type / Size</th>
                        <th className="p-4">Price / Night</th>
                        <th className="p-4">Amenities Count</th>
                        <th className="p-4 text-center">Operations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((r) => (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-4">
                            <div className="w-16 h-10 bg-cover bg-center border border-white/5" style={{ backgroundImage: `url('${r.imageUrl}')` }} />
                            <div>
                              <div className="font-semibold text-white uppercase">{r.name}</div>
                              <span className="text-[9px] text-gray-500 font-mono">/{r.slug}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>{r.bedType} Bed / {r.capacity} Pax</div>
                            <span className="text-[9px] text-gray-500">{r.size} sqm area</span>
                          </td>
                          <td className="p-4 text-accent font-semibold">${parseFloat(r.price).toLocaleString()}</td>
                          <td className="p-4">{r.amenities?.length || 0} items</td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => openEditModal(r)}
                                className="p-1.5 bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(r.id)}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-black transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. MESSAGES LEDGER */}
            {activeTab === "messages" && (
              <div className="overflow-x-auto border border-white/5 bg-navy-dark/40">
                <table className="w-full text-left font-sans text-xs tracking-wider border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-400 uppercase font-semibold text-[9px]">
                      <th className="p-4">Sender</th>
                      <th className="p-4">Message Inquiry</th>
                      <th className="p-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-white">
                          <div>{m.name}</div>
                          <div className="text-[10px] text-gray-400 font-sans mt-0.5">{m.email}</div>
                          <div className="text-[10px] text-gray-500 font-sans">{m.phone}</div>
                        </td>
                        <td className="p-4 text-gray-300 max-w-md break-words py-4 leading-relaxed font-sans">
                          {m.message}
                        </td>
                        <td className="p-4 text-gray-400 text-[10px]">{new Date(m.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* 5. ADD / EDIT SUITE MODAL */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-deep border border-accent/20 w-full max-w-xl max-h-[85vh] overflow-y-auto">
            {/* Top gold line */}
            <div className="h-1 bg-gradient-gold" />
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-lg font-serif font-bold uppercase tracking-wider">
                  {editingRoomId ? "Edit Suite Parameters" : "Register New Suite"}
                </h3>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleRoomSubmit} className="space-y-4 font-sans text-xs tracking-wider text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Suite Name</label>
                    <input
                      type="text"
                      required
                      value={roomForm.name}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Oceanfront Villa"
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={roomForm.slug}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="oceanfront-villa"
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Price / Night</label>
                    <input
                      type="number"
                      required
                      value={roomForm.price}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="950"
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Max Pax</label>
                    <input
                      type="number"
                      required
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, capacity: e.target.value }))}
                      placeholder="2"
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Size (SQM)</label>
                    <input
                      type="number"
                      required
                      value={roomForm.size}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, size: e.target.value }))}
                      placeholder="85"
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Bed Configuration</label>
                    <select
                      value={roomForm.bedType}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, bedType: e.target.value }))}
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-accent"
                    >
                      <option value="King">King Bed</option>
                      <option value="Queen">Queen Bed</option>
                      <option value="Double">Double Bed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Photo Image URL</label>
                    <input
                      type="text"
                      required
                      value={roomForm.imageUrl}
                      onChange={(e) => setRoomForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://unsplash.com/..."
                      className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase text-[9px]">Amenities (Separated by commas)</label>
                  <input
                    type="text"
                    value={roomForm.amenities}
                    onChange={(e) => setRoomForm((prev) => ({ ...prev, amenities: e.target.value }))}
                    placeholder="Ocean view, Private Pool, Butler Service, Circus Lights"
                    className="w-full bg-navy-dark border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase text-[9px]">Room Description</label>
                  <textarea
                    required
                    rows={4}
                    value={roomForm.description}
                    onChange={(e) => setRoomForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the villa space in full luxury terms..."
                    className="w-full bg-navy-dark border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                {formError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowRoomModal(false)}
                    className="px-6 py-2.5 border border-white/10 text-white hover:border-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-8 py-2.5 bg-gradient-gold text-navy-deep font-semibold border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500"
                  >
                    {formLoading ? "SAVING..." : "COMMIT ENTRY"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
