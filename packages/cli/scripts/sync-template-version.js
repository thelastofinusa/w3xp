import path from "path"
import { fileURLToPath } from "url"
import { readFileSync, writeFileSync } from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---- paths -----------------------------------------------------
const cliPkgPath = path.resolve(__dirname, "../package.json")
const uiPkgPath = path.resolve(__dirname, "../../ui/package.json")
const corePkgPath = path.resolve(__dirname, "../../core/package.json")
const templatePath = path.resolve(
  __dirname,
  "../templates/default/package.json.hbs"
)

// ---- read current versions -------------------------------------
const cliPkg = JSON.parse(readFileSync(cliPkgPath, "utf8"))
const uiPkg = JSON.parse(readFileSync(uiPkgPath, "utf8"))
const corePkg = JSON.parse(readFileSync(corePkgPath, "utf8"))

const cliVersion = cliPkg.version
const uiVersion = uiPkg.version
const coreVersion = corePkg.version

// ---- 1. Update the CLI's own dependency on @w3docs/core ---------
if (cliPkg.dependencies && cliPkg.dependencies["@w3docs/core"]) {
  cliPkg.dependencies["@w3docs/core"] = `^${coreVersion}`
  writeFileSync(cliPkgPath, JSON.stringify(cliPkg, null, 2) + "\n")
  console.log(`✅ CLI updated: @w3docs/core -> ^${coreVersion}`)
}

// ---- 2. Update the template (w3docs and @w3docs/ui) ------------
let template = readFileSync(templatePath, "utf8")

template = template.replace(
  /"w3docs":\s*"\^?[\d.]+"/g,
  `"w3docs": "^${cliVersion}"`
)

template = template.replace(
  /"@w3docs\/ui":\s*"\^?[\d.]+"/g,
  `"@w3docs/ui": "^${uiVersion}"`
)

writeFileSync(templatePath, template)
console.log(
  `✅ Template synced: w3docs -> ^${cliVersion}, @w3docs/ui -> ^${uiVersion}`
)
