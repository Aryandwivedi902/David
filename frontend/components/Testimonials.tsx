"use client";

import { Quote } from "lucide-react";

export default function Testimonials() {
  const list = [
    {
      quote: "Absolute discretion and perfect execution. The infinity pool deck feels like a private paradise suspended in the Malibu sky.",
      author: "Sofia Lorenze",
      role: "Luxury Critic",
    },
    {
      quote: "Bespoke is an understatement. The Sommelier Wine cellar tour was the highlight of our coastal escape.",
      author: "Dr. Marcus Vance",
      role: "Private Member",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {list.map((t, idx) => (
        <div key={idx} className="glass-card p-8 border border-white/5 bg-navy-light/10 relative text-left rounded-none">
          <Quote className="w-8 h-8 text-accent/20 absolute top-4 right-4" />
          <p className="text-gray-300 text-xs italic leading-relaxed mb-6 font-sans">
            "{t.quote}"
          </p>
          <div>
            <h4 className="text-xs font-bold tracking-widest text-accent uppercase font-sans">
              {t.author}
            </h4>
            <span className="text-[9px] text-gray-500 font-bold uppercase">{t.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
