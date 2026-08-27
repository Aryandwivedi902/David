"use client";

import { useState } from "react";
import { Compass, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function Gallery() {
  const images = [
    { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400", title: "Presidential Villa" },
    { url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400", title: "Michelin Restaurant" },
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400", title: "Thermal Spa Bath" },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400", title: "Malibu Beachfront" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {images.map((item, idx) => (
        <div key={idx} className="relative h-64 overflow-hidden border border-white/5 group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url('${item.url}')` }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Preview</span>
              <h4 className="text-white font-serif text-sm uppercase font-bold">{item.title}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
