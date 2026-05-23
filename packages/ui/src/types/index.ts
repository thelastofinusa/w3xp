export type TabKey = "read" | "write" | "events"

export interface W3DocsConfig {
  title: string
  description: string
  chain: string
  address: string
  verified: boolean
}

export interface ContractFunction {
  name: string
  type: "read" | "write"
  description?: string
  inputs: { name: string; type: string; description?: string }[]
  outputs: { type: string }[]
  stateMutability?: string
}

export interface ContractEvent {
  name: string
  signature: string
  description?: string
  inputs: { name: string; type: string; indexed?: boolean }[]
}

export interface UnifiedContract {
  name: string
  description: string
  address: string
  chain: string
  verified?: boolean
  functions: ContractFunction[]
  events: ContractEvent[]
}
