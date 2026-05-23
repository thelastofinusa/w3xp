import { ethers } from "ethers"
import { whatsabi } from "@shazow/whatsabi"
import { UnifiedContract } from "../../types"
import { SOURCIFY_SERVER } from "./constants"
import { normaliseRawAbi } from "./normaliseRawAbi"

// ---- Sourcify fetchers -----------------------------------------
export async function fetchEVMContract(
  network: string,
  address: string
): Promise<{ contract: UnifiedContract; rawAbi: any[] }> {
  const CHAIN_IDS: Record<string, number> = {
    ethereum: 1,
    polygon: 137,
    arbitrum: 42161,
    optimism: 10,
    base: 8453,
  }
  const chainId = CHAIN_IDS[network]
  if (!chainId) throw new Error(`Unsupported EVM network: ${network}`)

  const url = `${SOURCIFY_SERVER}/v2/contract/${chainId}/${address}?fields=all`
  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(`Contract not found on Sourcify (chain ${chainId})`)
  }
  const data = await resp.json()
  if (!data.abi || data.abi.length === 0) {
    throw new Error(`Empty ABI returned by Sourcify`)
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

export async function fetchEVMContractByChainId(
  chainId: number,
  address: string
): Promise<{ contract: UnifiedContract; rawAbi: any[] }> {
  const url = `${SOURCIFY_SERVER}/v2/contract/${chainId}/${address}?fields=all`
  const resp = await fetch(url)
  if (!resp.ok) {
    throw new Error(`Contract not found on Sourcify (chain ${chainId})`)
  }
  const data = await resp.json()
  if (!data.abi || data.abi.length === 0) {
    throw new Error(`Empty ABI returned by Sourcify`)
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

export async function fetchEVMContractViaWhatsABI(
  chainId: number,
  address: string,
  rpcUrl: string
): Promise<{ contract: UnifiedContract; rawAbi: any[] }> {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const code = await provider.getCode(address)
  if (code === "0x") {
    throw new Error("No bytecode found at the given address")
  }

  // 1. Get the raw ABI structure (with hex selectors)
  const rawAbiResult = whatsabi.abiFromBytecode(code)
  if (!rawAbiResult || rawAbiResult.length === 0) {
    throw new Error("Could not extract any function selectors from bytecode")
  }

  // 2. Resolve selectors via OpenChain (free, no API key)
  const lookup = new whatsabi.loaders.OpenChainSignatureLookup()
  const abi: any[] = []

  for (const item of rawAbiResult) {
    if (item.type === "function" && item.selector) {
      // Resolve the hex selector to a human-readable signature
      let name = item.selector
      let inputs: any[] = []

      try {
        const signatures = await lookup.loadFunctions(item.selector)
        if (signatures && signatures.length > 0) {
          const signature = signatures[0] // "increment()" or "transfer(address,uint256)"
          if (signature.includes("(")) {
            const [funcName, paramsStr] = signature.split("(")
            name = funcName
            const rawParams = paramsStr
              .replace(")", "")
              .split(",")
              .filter(Boolean)

            inputs = rawParams.map((type: string, idx: number) => {
              const parts = type.trim().split(" ")
              const paramType = parts[0]
              const paramName = parts[1] || `param${idx}`
              return { name: paramName, type: paramType }
            })
          }
        }
      } catch {
        // If resolution fails, keep the selector as name
      }

      abi.push({
        type: "function",
        name,
        inputs,
        outputs: [],
        stateMutability: item.payable ? "payable" : "nonpayable",
      })
    }
  }

  // 3. Normalise the guessed ABI
  return normaliseRawAbi(abi, address, String(chainId), "Contract")
}
