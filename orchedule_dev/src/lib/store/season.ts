// lib/store/season.ts
import { create } from "zustand";
export interface Season {
  _id: string;  // ✅ 수정: number -> string
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}


interface SeasonState {
  selectedSeason: Season | null;
  setSelectedSeason: (season:  Season | null) => void;
}

export const useSeasonStore = create<SeasonState>((set) => ({
  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),
}));
