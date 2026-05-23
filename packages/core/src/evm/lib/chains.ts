export interface NetworkOption {
  label: string
  value: string // chain ID as a string
  hint: string
}

export const POPULAR_EVM_NETWORKS: NetworkOption[] = [
  { label: "Ethereum", value: "1", hint: "Chain ID 1" },
  { label: "BNB Smart Chain", value: "56", hint: "Chain ID 56" },
  { label: "Polygon POS", value: "137", hint: "Chain ID 137" },
  { label: "Arbitrum One", value: "42161", hint: "Chain ID 42161" },
  { label: "Optimism", value: "10", hint: "Chain ID 10" },
  { label: "Base", value: "8453", hint: "Chain ID 8453" },
  { label: "Avalanche C‑Chain", value: "43114", hint: "Chain ID 43114" },
  { label: "Gnosis", value: "100", hint: "Chain ID 100" },
  { label: "Celo", value: "42220", hint: "Chain ID 42220" },
  { label: "Fantom", value: "250", hint: "Chain ID 250" },
  { label: "Moonbeam", value: "1284", hint: "Chain ID 1284" },
  { label: "Linea", value: "59144", hint: "Chain ID 59144" },
  { label: "Scroll", value: "534352", hint: "Chain ID 534352" },
  { label: "zkSync Era", value: "324", hint: "Chain ID 324" },
  { label: "Polygon zkEVM", value: "1101", hint: "Chain ID 1101" },
  { label: "Mantle", value: "5000", hint: "Chain ID 5000" },
  { label: "Cronos", value: "25", hint: "Chain ID 25" },
  { label: "Klaytn", value: "8217", hint: "Chain ID 8217" },
  { label: "Aurora", value: "1313161554", hint: "Chain ID 1313161554" },
  { label: "Metis", value: "1088", hint: "Chain ID 1088" },
]
