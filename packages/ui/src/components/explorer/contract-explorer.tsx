import { useUIStore } from "@w3docs/ui/store/index"
import { UnifiedContract } from "@w3docs/ui/types/index"
import { Hero } from "./hero.js"
import { TabBar } from "./tabBar.js"
import { FunctionCard } from "./function-card.js"
import { EventCard } from "./event-card.js"

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
      <div className="mx-auto max-w-5xl px-6 py-6 md:py-10">
        {activeTab === "read" && (
          <div className="space-y-3">
            {reads.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No read functions found.
              </p>
            )}
            {reads.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="read" />
            ))}
          </div>
        )}
        {activeTab === "write" && (
          <div className="space-y-3">
            {writes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No write functions found.
              </p>
            )}
            {writes.map((fn) => (
              <FunctionCard key={fn.name} fn={fn} mode="write" />
            ))}
          </div>
        )}
        {activeTab === "events" && (
          <div className="space-y-3">
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">No events found.</p>
            )}
            {events.map((ev) => (
              <EventCard key={ev.name} ev={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground md:py-32 lg:py-52">
    No matches for your search.
  </div>
)
