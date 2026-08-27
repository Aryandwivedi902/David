"use client";

import { Users, Maximize2, Bed, Check } from "lucide-react";
import { RoomData } from "./RoomCard";

interface RoomDetailsProps {
  room: RoomData;
}

export default function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <div className="space-y-8 font-sans text-xs tracking-wider text-left">
      <div className="space-y-4">
        <span className="text-accent text-[10px] font-bold tracking-widest uppercase">
          Suite Layout Specs
        </span>
        <h2 className="text-3xl font-serif text-white font-bold uppercase">{room.name}</h2>
        <p className="text-gray-400 text-sm leading-relaxed">{room.description}</p>
      </div>

      {/* Grid attributes */}
      <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-6 text-center text-[10px] font-bold text-gray-400">
        <div className="flex flex-col items-center gap-1 border-r border-white/5">
          <Users className="w-5 h-5 text-accent" />
          <span>CAPACITY: {room.capacity} GUESTS</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-white/5">
          <Maximize2 className="w-5 h-5 text-accent" />
          <span>SIZE: {room.size} SQ METERS</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Bed className="w-5 h-5 text-accent" />
          <span>BED TYPE: {room.bedType.toUpperCase()}</span>
        </div>
      </div>

      {/* Amenities preview */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-white uppercase block">
            Villa Inclusions
          </span>
          <div className="grid grid-cols-2 gap-3">
            {room.amenities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 text-accent flex-shrink-0" />
                <span>{item.amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
