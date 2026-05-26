import { twMerge } from "tailwind-merge"
import * as wagmiChains from "wagmi/chains"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChainById(chainId: string): wagmiChains.Chain | undefined {
  const id = parseInt(chainId, 10)
  return Object.values(wagmiChains).find(
    (chain) => typeof chain.id === "number" && chain.id === id
  ) as wagmiChains.Chain | undefined
}

export function getExplorerUrlForTx(chainId: number, txHash: string): string {
  const chain = getChainById(chainId.toString())
  const explorer = chain?.blockExplorers?.default
  if (explorer) return `${explorer.url}/tx/${txHash}`
  // Fallback: use a generic template
  return `https://explorer.${chain?.name?.toLowerCase() || "unknown"}.io/tx/${txHash}`
}
