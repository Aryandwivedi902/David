"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Key, Mail, ShieldAlert, AlertCircle } from "lucide-react";
import { loginAdmin } from "../../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if token already exists
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin({ email, passwordString: password });
      
      // Store JWT token and admin name
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.admin.name);
      
      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy-deep min-h-screen text-white flex items-center justify-center p-6 relative">
      {/* Background ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Floating Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold z-10" />

        <div className="glass-card p-10 border border-white/5 bg-navy-light/10 relative z-20 space-y-8 rounded-none">
          {/* Brand header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Compass className="w-6 h-6 text-accent group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-xl font-bold tracking-widest text-white font-serif">
                GRAND<span className="text-accent font-sans text-xs font-semibold tracking-widest ml-1">HORIZON</span>
              </span>
            </Link>
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-sans pt-3">
              ADMINISTRATIVE PRIVILEGED ACCESS
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>EMAIL ADDRESS</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@grandhorizon.com"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-accent rounded-none transition-colors"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-accent" />
                <span>SECRET PASSWORD</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-accent rounded-none transition-colors"
              />
            </div>

            {/* Error messaging */}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none transition-all duration-500 flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-white hover:border-white"
              }`}
            >
              {loading ? "AUTHENTICATING SECURITY..." : "AUTHORIZE ACCESS"}
            </button>
          </form>

          {/* Helper details */}
          <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 text-[9px] leading-relaxed text-gray-400 justify-center">
            <ShieldAlert className="w-4.5 h-4.5 text-accent flex-shrink-0" />
            <p>
              Protected network zone. All authorization attempts are recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
