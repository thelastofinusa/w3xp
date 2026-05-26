"use client"

import React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import * as chains from "wagmi/chains"
import type { Chain } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit"
import { getChainById } from "@w3docs/ui/lib/utils"
import { Button } from "../button"

const queryClient = new QueryClient()

type Web3ProviderProps = {
  children: React.ReactNode
  chainId?: number
  projectId?: string
}

export const Web3Provider = ({
  children,
  chainId = 1, // Defaults to Ethereum Mainnet
  projectId,
}: Web3ProviderProps) => {
  // Find the chain that matches the provided chainId
  const selectedChain = getChainById(chainId.toString()) as Chain | undefined

  // Fallback to mainnet if chain is not found
  const chain = selectedChain || chains.mainnet

  const config = createConfig(
    getDefaultConfig({
      chains: [chain],
      transports: {
        [chain.id]: http(chain.rpcUrls.default.http[0]),
      },
      walletConnectProjectId: projectId || "",
      appName: "w3docs",
      appDescription:
        "w3docs is a CLI tool that turns deployed smart contracts into beautiful, interactive documentation websites.",
      appUrl: "https://w3docs.vercel.app",
      appIcon: "https://w3docs.vercel.app/logo-white.png",
      enableAaveAccount: false,
    })
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-border-radius": "28px",
          }}
          theme="auto"
          mode="auto"
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export const ConnectWallet = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return (
          <Button onClick={show} variant="outline">
            {isConnected ? truncatedAddress : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

// import { useTheme } from "next-themes"

// const { resolvedTheme } = useTheme()

// theme={
//   resolvedTheme === "system"
//     ? "auto"
//     : resolvedTheme === "dark"
//       ? "midnight"
//       : "soft"
// }
// mode={
//   resolvedTheme === "system"
//     ? "auto"
//     : resolvedTheme === "dark"
//       ? "dark"
//       : "light"
// }
