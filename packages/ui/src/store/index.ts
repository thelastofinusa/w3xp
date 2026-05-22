import { create } from "zustand"
import { TabKey } from "../types/index.js"

interface UIState {
  search: string
  activeTab: TabKey
  chain: string // e.g. 'Ethereum'
  setSearch: (query: string) => void
  setActiveTab: (tab: TabKey) => void
  setChain: (chain: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  search: "",
  activeTab: "read",
  chain: "Ethereum",
  setSearch: (search) => set({ search }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setChain: (chain) => set({ chain }),
}))
