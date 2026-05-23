import { POPULAR_EVM_NETWORKS } from "@w3docs/core/evm"

export const CONTRACT_TYPES = [
  {
    label: "Solidity",
    value: "sol",
    hint: "EVM Compatible Chains",
    available: true,
    networkMessage: "Which EVM network is your contract deployed on?",
    networks: [
      ...POPULAR_EVM_NETWORKS,
      {
        label: "Custom (enter chain ID)",
        value: "custom",
        hint: "any EVM chain",
      },
    ],
  },
]
