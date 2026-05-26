import { UnifiedContract } from "../../types"
import { SOURCIFY_SERVER } from "./constants"
import { normaliseRawAbi } from "./normaliseRawAbi"

// ---- Sourcify fetchers -----------------------------------------
export async function fetchEVMContract(
  chainId: string,
  address: string
): Promise<{ contract: UnifiedContract; rawAbi: any[] }> {
  const url = `${SOURCIFY_SERVER}/v2/contract/${chainId}/${address}?fields=all`
  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(`Contract not found on network "${chainId}"`)
  }
  const data = await resp.json()
  if (!data.abi || data.abi.length === 0) {
    throw new Error(`The ABI for this contract is empty`)
  }
  return normaliseRawAbi(
    data.abi,
    address,
    String(chainId),
    data.compilation?.name || "Contract",
    data.devdoc,
    data.userdoc
  )
}
