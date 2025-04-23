// lib/store/season.ts
import { create } from "zustand";

export interface Season {
  id: number;
  name: string;
}

interface SeasonState {
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season) => void;
}

export const useSeasonStore = create<SeasonState>((set) => ({
  selectedSeason: null,
  setSelectedSeason: (season) => set({ selectedSeason: season }),
}));
