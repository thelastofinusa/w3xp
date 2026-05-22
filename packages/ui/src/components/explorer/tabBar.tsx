import { TabKey } from "@w3docs/ui/types/index"
import { Icons } from "hugeicons-proxy"
import { Container } from "../shared/container.js"

const TABS = [
  {
    key: "read" as TabKey,
    label: "Read Functions",
    icon: Icons.BookOpen02Icon,
    accent: "text-success",
  },
  {
    key: "write" as TabKey,
    label: "Write Functions",
    icon: Icons.PencilEdit02Icon,
    accent: "text-warning",
  },
  {
    key: "events" as TabKey,
    label: "Events",
    icon: Icons.TimelineEventIcon,
    accent: "text-info",
  },
]

export function TabBar({
  active,
  onChange,
  counts = { read: 0, write: 0, events: 0 },
}: {
  active: TabKey
  onChange: (k: TabKey) => void
  counts?: { read: number; write: number; events: number }
}) {
  return (
    <div className="sticky top-18 z-20 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex overflow-x-auto overflow-y-clip">
        {TABS.map((t) => {
          const isActive = t.key === active
          const count = counts[t.key]
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative flex w-full items-center justify-center gap-2 p-3 text-sm font-medium whitespace-nowrap transition-colors sm:w-max ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className={`size-4 ${isActive ? t.accent : ""}`} />
              {t.label}
              <span className="hidden rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:flex">
                {count}
              </span>
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all ${isActive ? "bg-primary" : "bg-transparent"}`}
              />
            </button>
          )
        })}
      </Container>
    </div>
  )
}
