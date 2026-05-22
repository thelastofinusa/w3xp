import color from "chalk"
import { Command } from "commander"

import pkg from "../package.json" with { type: "json" }
import generateDocs from "./commands/docs.js"
import showChains from "./commands/show.js"
import { CONTRACT_TYPES } from "./lib/constants.js"
import { devCommand } from "./commands/dev.js"
import { buildCommand } from "./commands/build.js"
import { previewCommand } from "./commands/preview.js"

const { name, version, description } = pkg

const program = new Command()

program
  .name(name)
  .description(description)
  .version(version, "-v, --version", "output the version number")

program
  .command("show")
  .description("show supported smart contract languages and chains")
  .action(async () => showChains())

program
  .command("dev")
  .description("start the documentation development server")
  .action(async () => await devCommand())

program
  .command("build")
  .description("build the documentation for production")
  .action(async () => await buildCommand())

program
  .command("preview")
  .description("preview the production build locally")
  .action(async () => await previewCommand())

const generateCommand = program
  .command("init")
  .description("initialize smart contract documentation")

// Dynamically register flags
for (const contract of CONTRACT_TYPES) {
  generateCommand.option(
    `--${contract.value}`,
    `generate documentation for ${color.cyan.bold(contract.label)} contracts`
  )
}

generateCommand.action(async (options) => {
  const selectedLanguage = CONTRACT_TYPES.find(
    (contract) => options[contract.value]
  )
  await generateDocs(selectedLanguage?.value)
})

if (process.argv.length <= 2) {
  console.clear()
  program.help()
} else {
  console.clear()
  program.parse()
}
