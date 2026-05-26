import React from "react"
import { containerVariants } from "@w3docs/ui/components/shared/container"

const rows = [
  {
    title: "Generate from deployed contracts",
    body: "Provide a contract address and network. w3docs fetches the metadata, resolves verified sources, and renders a full documentation site without writing a single page by hand.",
  },
  {
    title: "Interactive write functions",
    body: "Every write call becomes a real form, wired to the user's connected wallet. Inputs are typed, validated against each function parameter, and submitted as live transactions.",
  },
  {
    title: "Read contract state live",
    body: "View functions are executed against the connected RPC on load. Readers see the actual on-chain state instead of stale code snippets.",
  },
  {
    title: "Event explorers",
    body: "Each event gets its own page with recent logs, decoded arguments, and a filter UI — useful for protocol docs, audits, and integration work.",
  },
]

export const WhyW3Docs = () => {
  return (
    <section
      className={containerVariants({
        size: "sm",
        className: "px-0! pt-24 pb-20",
      })}
    >
      <div className={containerVariants({ size: "xs" })}>
        <h2 className="mt-4 max-w-sm font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          Documentation that runs against the chain
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          A small set of focused capabilities — designed for protocol teams,
          DAOs, and open source maintainers who want their docs to mean
          something.
        </p>
      </div>

      <div className="mt-10 px-5 sm:mt-12 sm:px-6">
        {rows.map((r) => (
          <div
            key={r.title}
            className="grid grid-cols-1 gap-2 border-t border-border py-6 sm:grid-cols-3 sm:gap-4 md:gap-8"
          >
            <div className="sm:col-span-1">
              <h3 className="font-serif text-lg tracking-tight text-foreground">
                {r.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-2">
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
