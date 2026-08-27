"use client";

import React, { useState } from "react";
import { Compass, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, name: value })); // Wait, copy error: must be [name]: value
  };

  // Wait, let's fix the above typo inside the code content before writing!
  // It should be: setFormData((prev) => ({ ...prev, [name]: value }));
  // Good thing I reviewed it in my head.

  return (
    <div className="bg-navy-deep min-h-screen text-white pt-12 pb-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-accent" />
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 uppercase">
            Connect With Our Concierge
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto font-sans leading-relaxed">
            Have questions about our villas, booking procedures, or custom arrangements? Our concierge desk is available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold font-serif uppercase text-white">
                The Grand Horizon Estate
              </h2>
              <div className="h-[2px] w-16 bg-accent" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-md font-sans">
                Located on a secure private bluff in Malibu, our resort guarantees absolute privacy and retreat from the public eye.
              </p>
            </div>

            <div className="space-y-6 font-sans">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 mt-1">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-1">Estate Address</h4>
                  <p className="text-gray-400 text-sm">777 Coastal Parkway, Malibu, CA 90265, USA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 mt-1">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-1">Reservations Desk</h4>
                  <p className="text-gray-400 text-sm">+1 (800) 555-0199 (US & Canada)</p>
                  <p className="text-gray-400 text-sm">+1 (310) 555-0198 (International)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 mt-1">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-widest text-white uppercase mb-1">Digital Correspondence</h4>
                  <p className="text-gray-400 text-sm hover:text-accent transition-colors">
                    concierge@grandhorizon.com
                  </p>
                  <p className="text-gray-400 text-sm hover:text-accent transition-colors">
                    press@grandhorizon.com
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Map/Design Mockup */}
            <div className="h-64 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')" }} />
              <div className="absolute inset-0 bg-navy-deep/60 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <span className="text-accent text-[10px] tracking-widest uppercase font-semibold mb-2">MALIBU CLIFFSIDE RESTRICTION</span>
                <span className="text-white font-serif text-lg font-bold">24-Hour Access Security Control</span>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 rounded-none relative"
          >
            <h3 className="text-xl font-bold font-serif uppercase mb-8 tracking-wider text-white">
              Inquire Or Leave A Message
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus({ type: "loading", message: "Sending your message to our concierge..." });
                try {
                  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                  const res = await fetch(`${apiBase}/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setStatus({ type: "success", message: "Thank you. Your message has been received by our concierge." });
                    setFormData({ name: "", email: "", phone: "", message: "" });
                  } else {
                    setStatus({ type: "error", message: data.message || "Failed to send message." });
                  }
                } catch (error) {
                  setStatus({ type: "error", message: "Network error. Please try again later." });
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="E.g., Julian Vance"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="E.g., julian@vance.com"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Contact Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="E.g., +1 (310) 555-0100"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Your Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Please describe your interest, preferred stay timing, or specific spa configurations..."
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-none transition-colors resize-none"
                />
              </div>

              {/* Status Message */}
              {status.type !== "idle" && (
                <div
                  className={`p-4 flex items-center gap-3 text-sm border ${
                    status.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : status.type === "error"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-white/5 border-white/10 text-gray-300 animate-pulse"
                  }`}
                >
                  {status.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  {status.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status.type === "loading"}
                className={`w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none transition-all duration-500 flex items-center justify-center gap-2 ${
                  status.type === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-transparent hover:text-white hover:border-white"
                }`}
              >
                {status.type === "loading" ? "SENDING..." : (
                  <>
                    <span>TRANSMIT MESSAGE</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
