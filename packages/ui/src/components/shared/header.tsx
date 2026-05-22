import { useUIStore } from "@w3docs/ui/store/index"
import { Icons } from "hugeicons-proxy"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group.js"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select.js"
import { Container } from "./container.js"

const CHAINS = ["Ethereum", "Polygon", "Solana", "Sui", "Starknet"] as const

export function Header() {
  const { search, setSearch, chain, setChain } = useUIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-18 items-center gap-4">
        <a
          href="/"
          className="flex items-center gap-2 font-medium tracking-tight"
        >
          <img
            src="/logo-white.png"
            alt="w3docs"
            width={22}
            height={22}
            className="hidden dark:block"
          />
          <img
            src="/logo-black.png"
            alt="w3docs"
            width={22}
            height={22}
            className="block dark:hidden"
          />
          <span>w3docs</span>
        </a>
        <InputGroup className="mx-auto hidden w-full max-w-md md:flex">
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search functions, events, types..."
          />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>
        <div className="relative ml-auto">
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ethereum" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CHAINS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Container>
      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search functions, events, types..."
          />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </header>
  )
}
