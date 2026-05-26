import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@w3docs/ui/components/accordion"
import { containerVariants } from "@w3docs/ui/components/shared/container"

const items = [
  {
    q: "What is w3docs?",
    a: "w3docs is a small CLI that turns a deployed smart contract into a complete, interactive documentation website — read calls, write calls, events, and ABI references included.",
  },
  {
    q: "Does it support verified contracts?",
    a: "Yes. For verified contracts on supported explorers, w3docs pulls source files and natspec to enrich the generated pages. Unverified contracts still produce a usable site from the ABI alone.",
  },
  {
    q: "Can I customize the generated website?",
    a: "The output is a regular Next.js project with MDX support. Override the theme, layout, or any individual component in your own repository — your changes survive regeneration.",
  },
  {
    q: "Is wallet interaction supported?",
    a: "Yes. Write functions are wired to the visitor's connected wallet via standard EVM wallet adapters. Read functions execute through the configured RPC.",
  },
  {
    q: "Which ecosystems are supported?",
    a: "Solidity and EVM chains are supported today, including Foundry and Hardhat projects. Solana, Starknet, and the Move-based chains are on the roadmap.",
  },
]

export const FAQs = () => {
  return (
    <section
      className={containerVariants({
        size: "sm",
        className: "px-0! pt-24 pb-20",
      })}
    >
      <div className={containerVariants({ size: "xs" })}>
        <h2 className="mt-4 max-w-sm font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          if you don't see your question here, let us know on GitHub or Twitter.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["item-0"]}
        className="mt-10 px-5 sm:mt-12 sm:px-6"
      >
        {items.map((it, i) => (
          <AccordionItem key={it.q} value={`item-${i}`}>
            <AccordionTrigger className="py-3 font-serif text-base text-lg tracking-tight text-foreground hover:no-underline">
              {it.q}
            </AccordionTrigger>
            <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
              {it.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
