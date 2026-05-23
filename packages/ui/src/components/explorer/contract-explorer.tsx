import { useUIStore } from "@w3docs/ui/store/index"
import { UnifiedContract } from "@w3docs/ui/types/index"
import { Hero } from "./hero"
import { TabBar } from "./tabBar"
import { FunctionCard } from "./function-card"
import { EventCard } from "./event-card"
import { Container } from "../shared/container"

export function ContractExplorer({ contract }: { contract: UnifiedContract }) {
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
    <div className="min-h-screen">
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
          <div className="space-y-3">
            {reads.length === 0 && (
              <EmptyState msg="No read functions found." />
            )}
            {reads.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="read" />
            ))}
          </div>
        )}
        {activeTab === "write" && (
          <div className="space-y-3">
            {writes.length === 0 && (
              <EmptyState msg="No write functions found." />
            )}
            {writes.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="write" />
            ))}
          </div>
        )}
        {activeTab === "events" && (
          <div className="space-y-3">
            {events.length === 0 && <EmptyState msg="No events found." />}
            {events.map((ev) => (
              <EventCard key={ev.name} ev={ev} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

const EmptyState = ({ msg }: { msg?: string }) => (
  <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground md:py-32 lg:py-52">
    {msg || "No matches for your search."}
  </div>
)
