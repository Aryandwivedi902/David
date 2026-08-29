"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, LogIn, LogOut, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ROOMS", href: "/rooms" },
    { name: "AMENITIES", href: "/amenities" },
    { name: "GALLERY", href: "/gallery" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-navy-deep/80 backdrop-blur-md shadow-lg border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Compass className="w-8 h-8 text-accent group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-2xl font-bold tracking-widest text-white font-serif">
            GRAND<span className="text-accent font-sans text-sm font-semibold tracking-widest ml-1">HORIZON</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs font-semibold tracking-widest transition-all duration-300 relative py-1 ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <motion.span
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}

          <div className="h-4 w-[1px] bg-white/10" />

          {user ? (
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-[10px] text-accent font-bold tracking-widest uppercase">
                <User className="w-3.5 h-3.5" />
                <span>{user.name.split(" ")[0]}</span>
              </span>
              <Link
                href="/my-bookings"
                className={`flex items-center gap-1.5 text-xs font-semibold tracking-widest transition-all duration-300 relative py-1 ${
                  isActive("/my-bookings")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>MY BOOKINGS</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-300 hover:text-accent transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-300 hover:text-accent transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </Link>
            </div>
          )}

          <Link href="/booking">
            <button className="px-6 py-2 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest rounded-none border border-accent hover:bg-transparent hover:text-white hover:border-white transition-all duration-500 gold-border-glow">
              BOOK YOUR STAY
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white hover:text-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-navy-deep/95 backdrop-blur-xl border-b border-white/10 shadow-2xl lg:hidden overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-4 border-b border-white/5 text-sm font-semibold tracking-widest transition-colors ${
                    isActive(link.href) ? "text-accent" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="py-4 border-b border-white/5 flex items-center gap-2 text-sm font-semibold tracking-widest text-accent uppercase">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <Link
                    href="/my-bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-4 border-b border-white/5 flex items-center gap-2 text-sm font-semibold tracking-widest transition-colors ${
                      isActive("/my-bookings") ? "text-accent" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>MY BOOKINGS</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-4 border-b border-white/5 flex items-center gap-2 text-sm font-semibold tracking-widest text-left text-gray-300 hover:text-accent transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>SIGN OUT</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-4 border-b border-white/5 flex items-center gap-2 text-sm font-semibold tracking-widest text-gray-300 hover:text-accent transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>LOGIN</span>
                </Link>
              )}

              <div className="pt-6 pb-4">
                <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none">
                    BOOK YOUR STAY
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

