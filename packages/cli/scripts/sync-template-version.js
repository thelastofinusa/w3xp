import { readFileSync, writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Paths
const cliPkgPath = path.resolve(__dirname, "../package.json")
const uiPkgPath = path.resolve(__dirname, "../../ui/package.json")
const templatePath = path.resolve(
  __dirname,
  "../templates/default/package.json.hbs"
)

// Read versions
const cliPkg = JSON.parse(readFileSync(cliPkgPath, "utf8"))
const uiPkg = JSON.parse(readFileSync(uiPkgPath, "utf8"))

const cliVersion = cliPkg.version
const uiVersion = uiPkg.version

// Read template
let template = readFileSync(templatePath, "utf8")

// Replace version placeholders
template = template.replace(/\{\{uiVersion\}\}/g, uiPkg.version)
template = template.replace(/\{\{cliVersion\}\}/g, cliPkg.version)

writeFileSync(templatePath, template)
console.log(
  `✅ Template synced: w3docs -> ^${cliVersion}, @w3docs/ui -> ^${uiVersion}`
)
