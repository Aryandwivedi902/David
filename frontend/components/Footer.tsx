"use client";

import Link from "next/link";
import { Compass, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-dark pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand & Logo */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Compass className="w-8 h-8 text-accent group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-2xl font-bold tracking-widest text-white font-serif">
                GRAND<span className="text-accent font-sans text-xs font-semibold tracking-widest ml-1">HORIZON</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              An award-winning sanctuary of wellness and fine hospitality. Where majestic horizons meet custom design and world-class culinary experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-6 font-sans">Discover</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-400 hover:text-accent transition-colors">Our Suites</Link>
              </li>
              <li>
                <Link href="/amenities" className="text-gray-400 hover:text-accent transition-colors">Amenities & Spa</Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-accent transition-colors">Visual Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-6 font-sans">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>777 Coastal Parkway, Malibu, California</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>reservations@grandhorizon.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-6 font-sans">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Receive updates on seasonal offerings and exclusive packages.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-navy-deep border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-accent text-xs rounded-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-gold text-navy-deep font-semibold text-xs tracking-widest border border-accent rounded-none hover:bg-transparent hover:text-white hover:border-white transition-all duration-500"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Big Watermark Logo & Copyright */}
        <div className="pt-12 border-t border-white/5 text-center">
          <h2 className="text-4xl md:text-7xl lg:text-[7.5rem] font-bold text-white/5 uppercase tracking-widest select-none mb-6 font-serif">
            GRAND HORIZON
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} The Grand Horizon Resort & Spa. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <Link href="/admin/login" className="hover:text-accent transition-colors font-semibold">Admin Portal</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
