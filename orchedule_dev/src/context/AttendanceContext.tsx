// src/context/AttendanceContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { attendanceFamilies } from '@/constants/parts';

type AttendanceContextType = {
  families: string[];
  selectedFamily: string;
  setSelectedFamily: (fam: string) => void;
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const families = attendanceFamilies;
  const [selectedFamily, setSelectedFamily] = useState(families[0]);
  return (
    <AttendanceContext.Provider value={{ families, selectedFamily, setSelectedFamily }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error('AttendanceProvider가 루트에 없습니다');
  return ctx;
}
