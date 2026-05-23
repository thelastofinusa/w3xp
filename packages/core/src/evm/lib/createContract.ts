import { UnifiedContract } from "../../types"
import { normaliseRawAbi } from "./normaliseRawAbi"

// ---- manual ABI helper -----------------------------------------
export function createContractFromAbi(
  abi: any[],
  address: string,
  chain: string,
  name = "Contract"
): { contract: UnifiedContract; rawAbi: any[] } {
  return normaliseRawAbi(abi, address, chain, name)
}
