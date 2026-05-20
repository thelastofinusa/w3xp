import { useState } from "react";
import { Search, Copy, Check, ExternalLink, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { UnifiedContract } from "../types";

const mockContract: UnifiedContract = {
  name: "USDC Token",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  chain: "Ethereum Mainnet",
  verified: true,
  functions: [
    {
      name: "balanceOf",
      type: "read",
      description: "Returns the token balance of an address.",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      name: "allowance",
      type: "read",
      description:
        "Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner.",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ type: "uint256" }],
    },
    {
      name: "transfer",
      type: "write",
      description:
        "Moves `amount` tokens from the caller’s account to `recipient`.",
      inputs: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ type: "bool" }],
    },
    {
      name: "approve",
      type: "write",
      description:
        "Sets `amount` as the allowance of `spender` over the caller’s tokens.",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ type: "bool" }],
    },
  ],
  events: [
    {
      name: "Transfer",
      signature:
        "Transfer(address indexed from, address indexed to, uint256 value)",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
    {
      name: "Approval",
      signature:
        "Approval(address indexed owner, address indexed spender, uint256 value)",
      inputs: [
        { name: "owner", type: "address", indexed: true },
        { name: "spender", type: "address", indexed: true },
        { name: "value", type: "uint256", indexed: false },
      ],
    },
  ],
};

export function W3DocPage() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  // We'll use the mock for now; later accept contract as a prop
  const contract = mockContract;

  const copyAddress = () => {
    navigator.clipboard.writeText(contract.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFunctions = contract.functions.filter((fn) =>
    fn.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredEvents = contract.events.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase()),
  );

  const readFunctions = filteredFunctions.filter((fn) => fn.type === "read");
  const writeFunctions = filteredFunctions.filter((fn) => fn.type === "write");

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header / Navbar */}
      <header className="border-b border-[#30363d] bg-[#161b22] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-white">
            w3docs
          </span>
          <span className="text-sm text-gray-400 hidden sm:inline">
            / {contract.chain}
          </span>
        </div>
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search functions or events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#0d1117] border-[#30363d] text-white h-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs text-gray-300 border-[#30363d]"
          >
            {contract.chain}
          </Badge>
        </div>
      </header>

      {/* Hero / Contract info */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{contract.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span className="font-mono text-[#58a6ff]">
                {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="inline-flex items-center gap-1 hover:text-white transition"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={`https://etherscan.io/address/${contract.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-white transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Etherscan
              </a>
            </div>
          </div>
          {contract.verified && (
            <Badge
              variant="secondary"
              className="bg-green-900/30 text-green-400 border-green-700 w-fit"
            >
              Verified
            </Badge>
          )}
        </div>
      </section>

      {/* Tabs & content */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <Tabs defaultValue="read" className="w-full">
          <TabsList className="mb-6 border-b border-[#30363d] rounded-none bg-transparent p-0 space-x-4">
            <TabsTrigger
              value="read"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#58a6ff] data-[state=active]:text-white rounded-none bg-transparent px-4 py-2 text-gray-400 hover:text-white"
            >
              Read Functions
            </TabsTrigger>
            <TabsTrigger
              value="write"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] data-[state=active]:text-white rounded-none bg-transparent px-4 py-2 text-gray-400 hover:text-white"
            >
              Write Functions
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#a855f7] data-[state=active]:text-white rounded-none bg-transparent px-4 py-2 text-gray-400 hover:text-white"
            >
              Events
            </TabsTrigger>
          </TabsList>

          {/* Read Functions */}
          <TabsContent value="read" className="space-y-4">
            {readFunctions.length === 0 && (
              <p className="text-gray-500 text-sm">No read functions found.</p>
            )}
            <Accordion type="multiple" className="space-y-3">
              {readFunctions.map((fn) => (
                <AccordionItem
                  key={fn.name}
                  value={fn.name}
                  className="border border-[#30363d] rounded-lg bg-[#161b22] data-[state=open]:border-[#58a6ff]/50"
                >
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-[#1c2129] rounded-t-lg group">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <span className="text-green-400 font-mono text-sm font-medium">
                        {fn.name}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {fn.description}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="space-y-4">
                      {/* Inputs */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Parameters
                        </h4>
                        {fn.inputs.length === 0 && (
                          <p className="text-xs text-gray-500">No parameters</p>
                        )}
                        {fn.inputs.map((param) => (
                          <div key={param.name} className="mb-3">
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              {param.name}{" "}
                              <span className="text-[#58a6ff]">
                                ({param.type})
                              </span>
                            </label>
                            <Input
                              placeholder={`Enter ${param.type}`}
                              className="bg-[#0d1117] border-[#30363d] text-white font-mono h-8"
                            />
                          </div>
                        ))}
                      </div>
                      {/* Output */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Output
                        </h4>
                        <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-3 font-mono text-sm text-[#7ee787]">
                          {/* Dummy response */}
                          {fn.outputs.map((out, i) => (
                            <div key={i}>→ {out.type}: ...</div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-[#30363d] hover:border-[#58a6ff] text-gray-300"
                      >
                        ▶ Try it
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Write Functions */}
          <TabsContent value="write" className="space-y-4">
            {writeFunctions.length === 0 && (
              <p className="text-gray-500 text-sm">No write functions found.</p>
            )}
            <Accordion type="multiple" className="space-y-3">
              {writeFunctions.map((fn) => (
                <AccordionItem
                  key={fn.name}
                  value={fn.name}
                  className="border border-[#30363d] rounded-lg bg-[#161b22] data-[state=open]:border-[#f97316]/50"
                >
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-[#1c2129] rounded-t-lg group">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <span className="text-orange-400 font-mono text-sm font-medium">
                        {fn.name}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {fn.description}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="space-y-4">
                      {/* Inputs */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Parameters
                        </h4>
                        {fn.inputs.map((param) => (
                          <div key={param.name} className="mb-3">
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              {param.name}{" "}
                              <span className="text-[#f97316]">
                                ({param.type})
                              </span>
                            </label>
                            <Input
                              placeholder={`Enter ${param.type}`}
                              className="bg-[#0d1117] border-[#30363d] text-white font-mono h-8"
                            />
                          </div>
                        ))}
                      </div>
                      {/* Wallet connection prompt */}
                      <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-300">
                            Connect your wallet to execute this function
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 border-[#30363d] text-gray-300"
                          >
                            Connect Wallet
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-4">
            {filteredEvents.length === 0 && (
              <p className="text-gray-500 text-sm">No events found.</p>
            )}
            <div className="space-y-3">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.name}
                  className="border border-[#30363d] rounded-lg bg-[#161b22] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 font-mono text-sm font-medium">
                      {ev.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {ev.signature}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ev.inputs.map((param) => (
                      <Badge
                        key={param.name}
                        variant="outline"
                        className="text-xs text-gray-400 border-[#30363d] font-mono"
                      >
                        {param.indexed ? "🔍 " : ""}
                        {param.type} {param.name}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-[#30363d] text-gray-400 hover:text-white"
                  >
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                    </span>
                    Listen
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
