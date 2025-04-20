'use client';

import React from 'react';
import { useAttendance } from '@/context/AttendanceContext';
import SectionChart from '@/components/attendance/SectionChart';
import { orderedParts, partFamilies } from '@/constants/parts';

export default function AttendanceStatusPage() {
  const { selectedFamily } = useAttendance();

  return (
    <div className="px-4 bg-[#FAF9F6]">
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {orderedParts
          .filter((part) => partFamilies[selectedFamily].includes(part))
          .map((part) => (
            <SectionChart key={part} part={part} />
          ))}
      </div>
    </div>
  );
}
