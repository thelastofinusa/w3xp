import { ContractFunction } from "@w3docs/ui/types/index"
import { Info } from "lucide-react"
import { useState } from "react"
import { Input } from "../input"

export function ParamInput({
  param,
  value,
  onChange,
  accent = "primary",
  disabled = false,
}: {
  param: ContractFunction["inputs"][number]
  value: string
  onChange: (v: string) => void
  accent?: "primary" | "warning" | "success"
  disabled?: boolean
}) {
  const [showTip, setShowTip] = useState(false)
  const ringClass =
    accent === "warning"
      ? "focus:border-warning focus:ring-warning/30"
      : accent === "success"
        ? "focus:border-success focus:ring-success/30"
        : "focus:border-primary focus:ring-primary/30"

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-sm">
        <span className="font-mono font-medium text-foreground">
          {param.name}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {param.type}
        </span>
        <span className="text-xs font-medium text-destructive">*required</span>
        {param.description && (
          <span className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onFocus={() => setShowTip(true)}
              onBlur={() => setShowTip(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Info"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showTip && (
              <span className="absolute top-1/2 left-5 z-10 w-56 -translate-y-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg">
                {param.description}
              </span>
            )}
          </span>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${param.type}`}
        className={`h-9 ${ringClass}`}
        disabled={disabled}
      />
    </div>
  )
}
