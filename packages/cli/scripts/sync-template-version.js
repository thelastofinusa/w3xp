import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const cliPkgPath = path.resolve(__dirname, "../package.json");
const uiPkgPath = path.resolve(__dirname, "../../ui/package.json"); // adjust if UI lives elsewhere
const templatePath = path.resolve(
  __dirname,
  "../templates/default/package.json.hbs",
);

// Read versions
const cliPkg = JSON.parse(readFileSync(cliPkgPath, "utf8"));
const uiPkg = JSON.parse(readFileSync(uiPkgPath, "utf8"));

const cliVersion = cliPkg.version; // e.g. 0.1.11
const uiVersion = uiPkg.version; // e.g. 0.1.2

// Read template
let template = readFileSync(templatePath, "utf8");

// Replace version placeholders (we'll use explicit version strings, not placeholders)
// We'll replace the exact version strings that appear after the package names.
// The template currently has hardcoded numbers like "^0.1.0". We'll replace them
// with the current versions.

// Replace w3docs version
template = template.replace(
  /"w3docs":\s*"\^?[\d.]+"/g,
  `"w3docs": "^${cliVersion}"`,
);

// Replace @w3docs/ui version
template = template.replace(
  /"@w3docs\/ui":\s*"\^?[\d.]+"/g,
  `"@w3docs/ui": "^${uiVersion}"`,
);

writeFileSync(templatePath, template);
console.log(
  `✅ Template synced: w3docs -> ^${cliVersion}, @w3docs/ui -> ^${uiVersion}`,
);
