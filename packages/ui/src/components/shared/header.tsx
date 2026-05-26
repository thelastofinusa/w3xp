import { useUIStore } from "@w3docs/ui/store/index"
import { Icons } from "hugeicons-proxy"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group"
import { Container } from "./container"
import { Button } from "../button"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Logo } from "./logo"
import { ConnectWallet } from "../provider/web3.provider"

export function Header() {
  const { search, setSearch } = useUIStore()
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-18 items-center gap-4">
        <div
          role="button"
          className="flex cursor-pointer items-center gap-2 font-medium tracking-tight"
        >
          <Logo className="size-5.5 fill-foreground text-foreground" />
          <span>w3docs</span>
        </div>
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
        <div className="relative ml-auto flex items-center gap-2">
          <ConnectWallet />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="pointer-events-auto"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Icons.Sun02Icon className="size-4" />
              ) : (
                <Icons.GibbousMoonIcon className="size-4" />
              )
            ) : (
              <div className="size-4" />
            )}
          </Button>
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
