"use client"

import { useUIStore } from "@w3docs/ui/store/index"
import { UnifiedContract } from "@w3docs/ui/types/index"

import { Hero } from "./hero"
import { TabBar } from "./tabBar"
import { FunctionCard } from "./function-card"
import { EventCard } from "./event-card"

import { Container } from "../shared/container"
import { Header } from "../shared/header"
import { Footer } from "../shared/footer"

import { Web3Provider } from "../provider/web3.provider"

import { Accordion } from "../accordion"
import { Abi } from "viem"

export function ContractExplorer({
  contract,
  abi,
  projectId,
}: {
  contract: UnifiedContract
  abi?: readonly unknown[] | Abi
  projectId?: string
}) {
  const { search, activeTab, setActiveTab } = useUIStore()

  const q = search.trim().toLowerCase()

  const reads = contract.functions.filter(
    (f) => f.type === "read" && (!q || f.name.toLowerCase().includes(q))
  )

  const writes = contract.functions.filter(
    (f) => f.type === "write" && (!q || f.name.toLowerCase().includes(q))
  )

  const events = contract.events.filter(
    (e) => !q || e.name.toLowerCase().includes(q)
  )

  return (
    <Web3Provider chainId={Number(contract.chain)} projectId={projectId}>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <Hero contract={contract} />

          <TabBar
            active={activeTab}
            onChange={setActiveTab}
            counts={{
              read: reads.length,
              write: writes.length,
              events: events.length,
            }}
          />

          <Container className="py-6 md:py-10">
            {activeTab === "read" && (
              <>
                {reads.length === 0 ? (
                  <EmptyState msg="No read functions found." />
                ) : (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={reads[0]?.name}
                    className="space-y-3"
                  >
                    {reads.map((fn) => (
                      <FunctionCard
                        key={fn.name}
                        fn={fn}
                        mode="read"
                        abi={abi}
                        contractAddress={contract.address as `0x${string}`}
                        chainId={Number(contract.chain)}
                      />
                    ))}
                  </Accordion>
                )}
              </>
            )}

            {activeTab === "write" && (
              <>
                {writes.length === 0 ? (
                  <EmptyState msg="No write functions found." />
                ) : (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={writes[0]?.name}
                    className="space-y-3"
                  >
                    {writes.map((fn) => (
                      <FunctionCard
                        key={fn.name}
                        fn={fn}
                        mode="write"
                        abi={abi}
                        contractAddress={contract.address as `0x${string}`}
                        chainId={Number(contract.chain)}
                      />
                    ))}
                  </Accordion>
                )}
              </>
            )}

            {activeTab === "events" && (
              <>
                {events.length === 0 ? (
                  <EmptyState msg="No events found." />
                ) : (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={events[0]?.name}
                    className="space-y-3"
                  >
                    {events.map((ev) => (
                      <EventCard key={ev.name} ev={ev} />
                    ))}
                  </Accordion>
                )}
              </>
            )}
          </Container>
        </main>

        <Footer />
      </div>
    </Web3Provider>
  )
}

const EmptyState = ({ msg }: { msg?: string }) => (
  <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground md:py-32 lg:py-52">
    {msg || "No matches for your search."}
  </div>
)
