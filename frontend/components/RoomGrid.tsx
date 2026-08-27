"use client";

import RoomCard, { RoomData } from "./RoomCard";

interface RoomGridProps {
  rooms: RoomData[];
}

export default function RoomGrid({ rooms }: RoomGridProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No suites currently match selection criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
