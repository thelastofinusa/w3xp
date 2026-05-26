"use client"

import { ContractExplorer } from "@w3docs/ui"
import { sampleABI, sampleContract } from "@/config/contract.config"

export default function Page() {
  return (
    <ContractExplorer
      contract={sampleContract}
      abi={sampleABI}
      projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!}
    />
  )
}
