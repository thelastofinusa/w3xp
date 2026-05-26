import type {
  UnifiedContract,
  ContractFunction,
  ContractEvent,
} from "../../types"

// ---- shared ABI → UnifiedContract normaliser -------------------
export function normaliseRawAbi(
  abi: any[],
  address: string,
  chainId: string,
  contractName = "Contract",
  devdoc?: any,
  userdoc?: any
): { contract: UnifiedContract; rawAbi: any[] } {
  const functions: ContractFunction[] = []
  const events: ContractEvent[] = []

  for (const item of abi) {
    if (item.type === "function") {
      functions.push({
        name: item.name,
        type:
          item.stateMutability === "view" || item.stateMutability === "pure"
            ? "read"
            : "write",
        description:
          devdoc?.methods?.[item.name]?.details ||
          userdoc?.methods?.[item.name]?.notice ||
          "",
        inputs: (item.inputs || []).map((i: any, idx: number) => ({
          name: i.name || `param${idx}`,
          type: i.type,
          description: devdoc?.methods?.[item.name]?.params?.[i.name] || "",
        })),
        outputs: (item.outputs || []).map((o: any) => ({ type: o.type })),
        stateMutability: item.stateMutability,
      })
    } else if (item.type === "event") {
      events.push({
        name: item.name,
        signature: `${item.name}(${item.inputs.map((i: any) => i.type).join(",")})`,
        description:
          devdoc?.events?.[item.name]?.details ||
          userdoc?.events?.[item.name]?.notice ||
          "",
        inputs: (item.inputs || []).map((i: any) => ({
          name: i.name || "",
          type: i.type,
          indexed: i.indexed ?? false,
        })),
      })
    }
  }

  const contract: UnifiedContract = {
    name: contractName,
    description:
      devdoc?.description ||
      userdoc?.description ||
      "Interactive documentation generated from the contract ABI. Inspect read methods, simulate writes, and listen to events — all from one place.",
    address,
    chain: chainId,
    verified: true,
    functions,
    events,
  }

  return { contract, rawAbi: abi }
}
