"use client";

import Link from "next/link";
import { Users, Maximize2, Bed, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export interface RoomData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  capacity: number;
  bedType: string;
  size: number;
  imageUrl: string;
  amenities?: { amenity: string }[];
}

export default function RoomCard({ room }: { room: RoomData }) {
  const formattedPrice = typeof room.price === "string" 
    ? parseFloat(room.price).toLocaleString() 
    : room.price.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card flex flex-col h-full relative overflow-hidden group border border-white/5 bg-navy-light/20"
    >
      {/* Room Image */}
      <div className="relative h-64 w-full overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${room.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 to-transparent" />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-4 right-4 bg-navy-deep/90 border border-accent/20 px-3 py-1.5 text-xs font-semibold tracking-widest text-accent font-sans">
          ₹{formattedPrice} <span className="text-gray-400 font-normal">/ NIGHT</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-sans">Luxury Suite</span>
          <h3 className="text-xl font-serif font-bold text-white uppercase group-hover:text-accent transition-colors duration-300">
            {room.name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-sans">
            {room.description}
          </p>
        </div>

        {/* Room Specs */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-4 text-[10px] font-semibold text-gray-400 tracking-wider font-sans text-center">
          <div className="flex flex-col items-center gap-1 border-r border-white/5">
            <Users className="w-4 h-4 text-accent" />
            <span>{room.capacity} GUESTS</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-white/5">
            <Maximize2 className="w-4 h-4 text-accent" />
            <span>{room.size} SQM</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bed className="w-4 h-4 text-accent" />
            <span className="truncate w-full max-w-[70px]">{room.bedType.toUpperCase()}</span>
          </div>
        </div>

        {/* Button Actions */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Link href={`/rooms/${room.slug}`} className="w-full">
            <button className="w-full py-2.5 bg-white/5 border border-white/10 hover:border-white text-[10px] font-semibold tracking-widest text-white transition-all duration-300 rounded-none flex items-center justify-center gap-1.5">
              <span>VIEW DETAIL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </Link>
          <Link href={`/booking?room=${room.id}`} className="w-full">
            <button className="w-full py-2.5 bg-gradient-gold text-navy-deep border border-accent text-[10px] font-semibold tracking-widest transition-all duration-500 rounded-none hover:bg-transparent hover:text-white hover:border-white gold-border-glow">
              BOOK NOW
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
