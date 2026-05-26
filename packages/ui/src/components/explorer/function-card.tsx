"use client"

import { useMemo, useState } from "react"
import {
  Abi,
  BaseError,
  ContractFunctionRevertedError,
  RpcRequestError,
} from "viem"

import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions"

import { useConnection, useConfig } from "wagmi"

import { AccordionContent, AccordionItem, AccordionTrigger } from "../accordion"

import { CodeBlock } from "./code-block"
import { ParamInput } from "./param-input"

import { Icons } from "hugeicons-proxy"

import { ContractFunction } from "@w3docs/ui/types/index"

import { cn, getExplorerUrlForTx } from "@w3docs/ui/lib/utils"

import { Button } from "../button"
import { ConnectWallet } from "../provider/web3.provider"

type Mode = "read" | "write"

type ResponseState = {
  value: string
  timestamp: string
  gas: string
  flash: number
}

function parseInputValue(value: string, type: string): unknown {
  if (value === "") return undefined

  try {
    if (type.endsWith("[]")) {
      return value.split(",").map((v) => v.trim())
    }

    if (type.includes("uint") || type.includes("int")) {
      return BigInt(value)
    }

    if (type === "bool") {
      return value === "true"
    }

    if (type.startsWith("tuple")) {
      return JSON.parse(value)
    }

    return value
  } catch {
    return undefined
  }
}

function serialize(value: unknown) {
  return JSON.stringify(
    value,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    2
  )
}

export function getContractError(error: unknown): string {
  if (error instanceof BaseError) {
    const revertedError = error.walk(
      (err) => err instanceof ContractFunctionRevertedError
    )

    if (revertedError instanceof ContractFunctionRevertedError) {
      return (
        revertedError.reason ||
        revertedError.shortMessage ||
        "Transaction reverted"
      )
    }

    const rpcError = error.walk((err) => err instanceof RpcRequestError)

    if (rpcError instanceof RpcRequestError) {
      return rpcError.details.replace("execution reverted: ", "")
    }

    return error.shortMessage || error.message || "Something went wrong."
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong."
}

export function FunctionCard({
  fn,
  mode,
  abi,
  contractAddress,
  chainId,
}: {
  fn: ContractFunction
  mode: Mode
  abi?: readonly unknown[] | Abi
  contractAddress?: `0x${string}`
  chainId?: number
}) {
  const config = useConfig()

  const { address, isConnected } = useConnection()

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fn.inputs.map((p) => [p.name, ""]))
  )

  const [response, setResponse] = useState<ResponseState | null>(null)

  const [error, setError] = useState<string | null>(null)

  const accentText = mode === "read" ? "text-success" : "text-warning"

  const accentBg = mode === "read" ? "bg-success/10" : "bg-warning/10"

  const accentBorder =
    mode === "read"
      ? "data-[state=open]:border-success/40 data-[state=open]:bg-success/5"
      : "data-[state=open]:border-warning/40 data-[state=open]:bg-warning/5"

  const buttonVariant = mode === "read" ? "success" : "warning"

  const inputsValid = useMemo(() => {
    return fn.inputs.every((input) => {
      const val = values[input.name] ?? ""

      if (input.type === "string") {
        return true
      }

      return val.trim() !== ""
    })
  }, [fn.inputs, values])

  const signature = `function ${fn.name}(${fn.inputs
    .map((i) => `${i.type} ${i.name}`)
    .join(", ")})${
    mode === "read"
      ? ` view returns (${fn.outputs?.map((o) => o.type).join(", ") || "void"})`
      : ""
  }`

  async function execute() {
    try {
      setLoading(true)
      setError(null)
      setResponse(null)

      if (!inputsValid) {
        throw new Error("Please fill in all required parameters.")
      }

      const args = fn.inputs.map((input) =>
        parseInputValue(values[input.name] ?? "", input.type)
      )

      if (mode === "read") {
        const result = await readContract(config, {
          abi: abi as Abi,
          address: contractAddress!,
          functionName: fn.name,
          args,
          chainId,
          account: address,
        })

        setResponse({
          value: serialize(result),
          timestamp: new Date().toLocaleTimeString(),
          gas: "N/A",
          flash: Date.now(),
        })

        return
      }

      const simulation = await simulateContract(config, {
        abi: abi as Abi,
        address: contractAddress!,
        functionName: fn.name,
        args,
        account: address,
        chainId,
      })

      const hash = await writeContract(config, simulation.request)

      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId,
      })

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted.")
      }

      const explorerUrl = getExplorerUrlForTx(chainId!, hash)

      setResponse({
        value: serialize({
          hash,
          explorerUrl,
          status: receipt.status,
          gasUsed: receipt.gasUsed.toString(),
          blockNumber: receipt.blockNumber.toString(),
        }),
        timestamp: new Date().toLocaleTimeString(),
        gas: `${receipt.gasUsed.toString()} gas`,
        flash: Date.now(),
      })
    } catch (err) {
      setError(getContractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AccordionItem
      value={fn.name}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200",
        accentBorder
      )}
    >
      <AccordionTrigger
        className={cn(
          "px-4 py-3 hover:no-underline",
          mode === "read"
            ? "data-[state=open]:text-success"
            : "data-[state=open]:text-warning"
        )}
      >
        <div className="flex w-full items-center gap-3 text-left">
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-md px-2 font-mono text-xs font-semibold",
              accentText,
              accentBg
            )}
          >
            {mode === "read" ? "GET" : "POST"}
          </span>

          <span className="font-mono text-sm font-semibold">{fn.name}</span>

          <span className="hidden text-sm text-muted-foreground md:inline">
            {fn.description || signature}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="h-full! border-t border-border px-4 py-4">
        <div className="mb-4">
          <CodeBlock code={signature} language="solidity" />
        </div>

        {fn.inputs.length > 0 && (
          <div className="mb-4 grid gap-3">
            {fn.inputs.map((param) => (
              <ParamInput
                key={param.name}
                param={param}
                value={values[param.name] ?? ""}
                onChange={(v) =>
                  setValues((prev) => ({
                    ...prev,
                    [param.name]: v,
                  }))
                }
                accent={mode === "read" ? "success" : "warning"}
                disabled={loading}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <pre className="overflow-x-auto wrap-break-word whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {mode === "write" && !isConnected ? (
            <ConnectWallet />
          ) : (
            <Button
              variant={buttonVariant}
              onClick={execute}
              disabled={loading || !inputsValid}
              isLoading={loading}
              loadingText={mode === "read" ? "Fetching..." : "Processing..."}
            >
              <Icons.PlayIcon className="size-4" />

              {mode === "write" ? "Execute" : "Try it"}
            </Button>
          )}
        </div>

        {response && (
          <div className="mt-4">
            <CodeBlock code={response.value} language="json" />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
