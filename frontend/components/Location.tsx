"use client";

import { MapPin, Phone, Mail } from "lucide-react";

export default function Location() {
  return (
    <div className="glass-card p-8 border border-white/5 bg-navy-light/10 w-full grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs tracking-wider text-left">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase mb-1">Estate Location</h4>
          <p className="text-gray-400">777 Coastal Parkway, Malibu, CA 90265, USA</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Phone className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase mb-1">Reservations Desk</h4>
          <p className="text-gray-400">+1 (800) 555-0199 (Toll Free)</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold text-white uppercase mb-1">Correspondence</h4>
          <p className="text-gray-400">concierge@grandhorizon.com</p>
        </div>
      </div>
    </div>
  );
}
