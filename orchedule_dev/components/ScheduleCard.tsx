'use client';

import React from 'react';

interface ScheduleCardProps {
  time: string;
  description: string;
  color?: string; 
}

export default function ScheduleCard({ time, description, color = '#A5796E' }: ScheduleCardProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div
        className="text-white text-xs font-medium px-2 py-1 rounded-md w-[70px] text-center"
        style={{ backgroundColor: color }}
      >
        {time}
      </div>
      <div className="bg-white text-sm text-[#3E3232] rounded-md px-3 py-2 shadow-sm flex-1">
        {description}
      </div>
    </div>
  );
}
