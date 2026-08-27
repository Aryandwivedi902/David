"use client";

import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-12 text-center w-full">
      <div className="space-y-4">
        <Compass className="w-10 h-10 text-accent animate-spin mx-auto" />
        <p className="text-[10px] font-bold tracking-widest text-accent uppercase animate-pulse font-sans">
          Synchronizing Registry...
        </p>
      </div>
    </div>
  );
}
