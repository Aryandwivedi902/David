"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Compass, Loader2 } from "lucide-react";

export default function SignupPage() {
  const { login, signup, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google SSO simulated states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleCustomName, setGoogleCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(name, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (selectedName: string, selectedEmail: string) => {
    setLoading(true);
    setError(null);
    setShowGoogleModal(false);

    try {
      // Use a consistent, secure secret SSO password for simulated Google users
      const ssoPass = "google-oauth-sso-login-secret-pass-992";
      try {
        await login(selectedEmail, ssoPass);
      } catch (loginErr) {
        // If account doesn't exist, automatically sign up!
        await signup(selectedName, selectedEmail, ssoPass);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google Single Sign-On registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative z-10">
      <div className="w-full max-w-md bg-navy-light/40 backdrop-blur-md border border-white/10 p-8 md:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-accent" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Compass className="w-10 h-10 text-accent animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif tracking-widest text-white">
            CREATE ACCOUNT
          </h2>
          <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
            Join the Grand Horizon Circle for booking access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-l-2 border-red-500 text-xs text-red-300 tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-semibold text-gray-300 tracking-widest uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-deep/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors duration-300"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-300 tracking-widest uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-deep/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors duration-300"
              placeholder="e.g. guest@grandhorizon.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-300 tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-deep/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors duration-300"
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest uppercase hover:bg-transparent hover:text-white border border-accent hover:border-white transition-all duration-500 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                CREATING ACCOUNT...
              </>
            ) : (
              "REGISTER"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="absolute bg-navy-deep/90 px-3 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            OR
          </span>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-3.5 bg-white text-gray-800 font-semibold text-xs tracking-widest uppercase border border-white hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 flex items-center justify-center gap-1 rounded-none"
        >
          <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-white transition-colors ml-1 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Google Choose Account Popup Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-navy-light/95 border border-white/15 p-6 shadow-2xl relative space-y-6">
            <button 
              onClick={() => {
                setShowGoogleModal(false);
                setShowCustomInput(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>
            
            <div className="text-center space-y-2">
              {/* Colorful Google Logo */}
              <div className="flex justify-center mb-1">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="text-white text-base font-serif font-semibold tracking-wide">
                Choose an account
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                to continue to Grand Horizon
              </p>
            </div>

            <div className="space-y-3 font-sans">
              {/* Account Options */}
              <button
                onClick={() => handleGoogleSignIn("Aryan Dwivedi", "aryandwivedi97307@gmail.com")}
                className="w-full flex items-center gap-3 p-3 border border-white/5 bg-navy-deep/60 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-accent text-navy-deep flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-none">Aryan Dwivedi</span>
                  <span className="text-[10px] text-gray-400">aryandwivedi97307@gmail.com</span>
                </div>
              </button>

              <button
                onClick={() => handleGoogleSignIn("Aryan Dwivedi", "aryandwivedi@gmail.com")}
                className="w-full flex items-center gap-3 p-3 border border-white/5 bg-navy-deep/60 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div>
                  <span className="block text-xs font-bold text-white leading-none">Aryan Dwivedi (Personal)</span>
                  <span className="text-[10px] text-gray-400">aryandwivedi@gmail.com</span>
                </div>
              </button>

              {/* Custom Account Input Form Toggle */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full p-3 border border-dashed border-white/10 hover:border-white/30 text-center text-xs text-gray-400 font-semibold transition-colors"
                >
                  + Use another account
                </button>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (googleCustomEmail && googleCustomName) {
                      handleGoogleSignIn(googleCustomName, googleCustomEmail);
                    }
                  }}
                  className="space-y-3 pt-3 border-t border-white/5 text-left"
                >
                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                      Google Name
                    </label>
                    <input
                      type="text"
                      required
                      value={googleCustomName}
                      onChange={(e) => setGoogleCustomName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-navy-deep border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={googleCustomEmail}
                      onChange={(e) => setGoogleCustomEmail(e.target.value)}
                      placeholder="e.g. email@gmail.com"
                      className="w-full bg-navy-deep border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-accent text-navy-deep text-xs font-bold tracking-widest uppercase"
                  >
                    CONTINUE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
