import { create } from "zustand"
import { TabKey } from "../types/index"

interface UIState {
  search: string
  activeTab: TabKey
  chain: number // e.g. 1
  setSearch: (query: string) => void
  setActiveTab: (tab: TabKey) => void
  setChain: (chain: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  search: "",
  activeTab: "read",
  chain: 1,
  setSearch: (search) => set({ search }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setChain: (chain) => set({ chain }),
}))
