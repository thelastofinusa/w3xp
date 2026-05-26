import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import * as p from "@clack/prompts"
import { fileURLToPath } from "url"

function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  let dir = currentDir
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) throw new Error("Could not find package root")
    dir = parent
  }
}

const PACKAGE_ROOT = getPackageRoot()
const TEMPLATE_DIR = path.resolve(PACKAGE_ROOT, "templates/default")

interface ScaffoldOptions {
  targetDir: string
  displayName: string
  chain: string
  address: string
  verified: boolean
  title?: string
  language?: string
  contractData?: string
  rawAbi?: string
}

function detectPackageManager(): string {
  const ua = process.env.npm_config_user_agent ?? ""
  if (ua.startsWith("pnpm")) return "pnpm"
  if (ua.startsWith("yarn")) return "yarn"
  if (ua.startsWith("bun")) return "bun"
  return "npm"
}

function replacePlaceholders(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => values[key] ?? `{{${key}}}`
  )
}

export async function scaffoldProject(options: ScaffoldOptions) {
  const {
    targetDir,
    displayName,
    chain,
    address,
    verified,
    title,
    contractData,
    rawAbi,
  } = options

  if (!fs.existsSync(TEMPLATE_DIR)) {
    throw new Error(`Template missing at ${TEMPLATE_DIR}`)
  }

  fs.copySync(TEMPLATE_DIR, targetDir)

  const values = {
    projectName: displayName,
    title: title || displayName,
    chain,
    address,
    verified: String(verified),
    generatedAt: new Date().toISOString(),
    htmlTitle: `${title || displayName} - w3docs`,
  }

  const processDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue
        processDirectory(fullPath)
      } else if (entry.name.endsWith(".hbs")) {
        let raw = fs.readFileSync(fullPath, "utf8")
        raw = replacePlaceholders(raw, values)
        const newPath = fullPath.replace(/\.hbs$/, "")
        if (newPath.endsWith(".json")) {
          try {
            const parsed = JSON.parse(raw)
            raw = JSON.stringify(parsed, null, 2)
          } catch {}
        }
        fs.writeFileSync(newPath, raw)
        fs.removeSync(fullPath)
      }
    }
  }

  processDirectory(targetDir)

  if (contractData) {
    fs.writeFileSync(
      path.join(targetDir, ".w3docs", "contract.json"),
      contractData
    )
  }
  if (rawAbi) {
    fs.writeFileSync(path.join(targetDir, ".w3docs", "abi.json"), rawAbi)
  }

  const pm = detectPackageManager()
  const isCurrentDir = displayName === path.basename(process.cwd())

  const lines = [
    `${chalk.bold.greenBright(title || displayName)} ready at ${chalk.greenBright(targetDir)}`,
    "",
    "Next steps:",
  ]

  if (!isCurrentDir) {
    lines.push(` - ${chalk.greenBright("cd")} ${chalk.bold(displayName)}`)
  }
  lines.push(` - ${chalk.greenBright(pm)} install`)
  lines.push(` - ${chalk.greenBright(pm)} dev`)

  p.outro(lines.join("\n"))

  return targetDir
}
