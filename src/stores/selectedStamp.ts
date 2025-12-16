import { create } from "zustand";

interface SelectedStampStore {
  selectedStamp: string | null;
  setSelectedStamp: (stamp: string | null) => void;
}

export const useSelectedStampStore = create<SelectedStampStore>((set) => ({
  selectedStamp: null,
  setSelectedStamp: (stamp) => set({ selectedStamp: stamp }),
}));
