import fs from "fs-extra"
import path from "path"
import { execa } from "execa"
import color from "chalk"
import * as p from "@clack/prompts"
import { fileURLToPath } from "url"
import { sleep } from "./utils.js"

// ---- locate the CLI package root ----
function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  let dir = currentDir
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      throw new Error("Could not find package root")
    }
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
  spinner: ReturnType<typeof p.spinner> // required, created in docs.ts
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
    language,
    spinner,
  } = options

  // Check for existing directory
  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${displayName}" already exists (unexpected).`)
  }

  // 1. Verify template exists
  if (!fs.existsSync(TEMPLATE_DIR)) {
    throw new Error(`Template missing at ${TEMPLATE_DIR}`)
  }

  // 2. Copy template and compile placeholders
  fs.copySync(TEMPLATE_DIR, targetDir)

  const values = {
    projectName: displayName,
    title: title || displayName,
    chain,
    address,
    verified: String(verified),
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

  // 3. Install dependencies
  const pm = detectPackageManager()
  spinner.message(color.cyan(`Installing dependencies with ${pm}`))

  let installFailed = false
  try {
    await execa(pm, ["install"], { cwd: targetDir, stdio: "pipe" })
  } catch {
    installFailed = true
  }

  if (installFailed) {
    spinner.error(color.red("Dependency installation failed"))
    p.log.warn(`Installation failed. You can run \`${pm} install\` manually.`)
  } else {
    spinner.stop(color.green("Project generated successfully."))
  }

  // Summary & next steps (spinner will be stopped by caller)
  const directoryLabel =
    displayName === path.basename(process.cwd()) ? "./" : `./${displayName}`

  p.log.message(
    [
      `${color.cyan("→")} ${color.bold("Language")}   ${color.gray(language ?? "Solidity")}`,
      `${color.cyan("→")} ${color.bold("Network")}    ${color.gray(chain)}`,
      `${color.cyan("→")} ${color.bold("Address")}    ${color.gray(address)}`,
      `${color.cyan("→")} ${color.bold("Directory")}  ${color.gray(directoryLabel)}`,
    ].join("\n")
  )

  const nextSteps = [
    `${color.green(`Build complete. ${color.bold("Your on-chain interface is ready.")}`)}`,
    "",
    `${color.bold("Next steps:")}`,
  ]
  if (displayName !== path.basename(process.cwd())) {
    nextSteps.push(` ${color.cyan("$")} cd ${displayName}`)
  }
  nextSteps.push(` ${color.cyan("$")} ${pm} run dev`)

  p.outro(nextSteps.join("\n"))

  return targetDir
}
