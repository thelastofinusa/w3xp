export interface NetworkOption {
  label: string
  value: string
}

export const POPULAR_EVM_NETWORKS: NetworkOption[] = [
  // Ethereum
  { label: "Ethereum", value: "1" },
  { label: "Sepolia Testnet", value: "11155111" },

  // Arbitrum
  { label: "Arbitrum One", value: "42161" },
  { label: "Arbitrum Sepolia", value: "421614" },

  // Optimism
  { label: "Optimism", value: "10" },
  { label: "OP Sepolia Testnet", value: "11155420" },

  // Avalanche
  { label: "Avalanche C-Chain", value: "43114" },
  { label: "Avalanche Fuji Testnet", value: "43113" },
]
