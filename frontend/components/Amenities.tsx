"use client";

import { Waves, Snowflake, Wine, Ship } from "lucide-react";

export default function Amenities() {
  const preview = [
    { icon: <Waves className="w-5 h-5 text-accent" />, name: "Infinity Sky Pool" },
    { icon: <Snowflake className="w-5 h-5 text-accent" />, name: "Zen thermal baths" },
    { icon: <Wine className="w-5 h-5 text-accent" />, name: "Sommelier cellar" },
    { icon: <Ship className="w-5 h-5 text-accent" />, name: "Private charters" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {preview.map((a, idx) => (
        <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 text-[10px] font-bold tracking-widest uppercase">
          <div className="p-2 bg-navy-deep border border-white/10 rounded-full">
            {a.icon}
          </div>
          <span className="text-gray-300 font-sans">{a.name}</span>
        </div>
      ))}
    </div>
  );
}
