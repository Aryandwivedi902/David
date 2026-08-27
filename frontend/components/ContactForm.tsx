"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactMessage } from "../lib/api";

export default function ContactForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Transmitting message..." });
    try {
      await sendContactMessage(formData);
      setStatus({ type: "success", message: "Inquiry received. A representative will contact you." });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to submit message." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs tracking-wider text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-gray-400 font-bold uppercase text-[9px]">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Julian Vance"
            className="w-full bg-navy-deep border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-bold uppercase text-[9px]">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="julian@vance.com"
            className="w-full bg-navy-deep border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-gray-400 font-bold uppercase text-[9px]">Contact Phone</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="+1 (310) 555-0100"
          className="w-full bg-navy-deep border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1">
        <label className="text-gray-400 font-bold uppercase text-[9px]">Message</label>
        <textarea
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Please describe stay details..."
          className="w-full bg-navy-deep border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-accent resize-none font-sans"
        />
      </div>

      {status.type !== "idle" && (
        <div className={`p-3 border flex items-center gap-2 text-[10px] ${
          status.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          status.type === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-white/5 border-white/10 text-gray-300 animate-pulse"
        }`}>
          {status.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          {status.type === "error" && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="w-full py-3.5 bg-gradient-gold text-navy-deep font-bold border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 flex items-center justify-center gap-1.5"
      >
        <span>SEND MESSAGE</span>
        <Send className="w-3 h-3" />
      </button>
    </form>
  );
}
