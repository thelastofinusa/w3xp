import { POPULAR_EVM_NETWORKS } from "@w3docs/core/evm"

export const CONTRACT_TYPES = [
  {
    label: "Solidity",
    value: "sol",
    hint: "Ethereum & EVM-compatible smart contracts",
    available: true,
    networkMessage: "Select the network your contract is deployed on.",
    networks: [
      ...POPULAR_EVM_NETWORKS.map((network) => ({
        label: network.label,
        value: network.value,
        hint: `Chain ID: ${network.value}`,
      })),
      {
        label: "Custom Chain ID",
        value: "custom",
        hint: "Can't find your network? Add a chain ID",
      },
    ],
  },
  {
    label: "Rust",
    value: "rust",
    hint: "Solana programs built with Rust",
    available: false,
    networkMessage: "Choose the Solana cluster where your program is deployed.",
    networks: [
      {
        label: "Mainnet Beta",
        value: "mainnet-beta",
        hint: "Production Solana network",
      },
      {
        label: "Devnet",
        value: "devnet",
        hint: "Development and testing environment",
      },
      {
        label: "Testnet",
        value: "testnet",
        hint: "Validator and protocol testing network",
      },
    ],
  },
  {
    label: "Cairo",
    value: "cairo",
    hint: "Starknet smart contracts written in Cairo",
    available: false,
    networkMessage:
      "Select the Starknet environment where your contract is deployed.",
    networks: [
      {
        label: "Mainnet",
        value: "mainnet",
        hint: "Live Starknet production network",
      },
      {
        label: "Sepolia Testnet",
        value: "sepolia",
        hint: "Starknet Sepolia testing environment",
      },
    ],
  },
  {
    label: "Sui Move",
    value: "sui",
    hint: "Move-based smart contracts for the Sui network",
    available: false,
    networkMessage:
      "Choose the Sui network where your package or contract is deployed.",
    networks: [
      {
        label: "Mainnet",
        value: "mainnet",
        hint: "Live Sui production network",
      },
      {
        label: "Testnet",
        value: "testnet",
        hint: "Public Sui testing environment",
      },
      {
        label: "Devnet",
        value: "devnet",
        hint: "Developer-focused experimental network",
      },
    ],
  },
]
