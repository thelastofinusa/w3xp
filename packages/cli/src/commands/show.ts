import * as p from "@clack/prompts"
import chalk from "chalk"
import pkg from "../../package.json" with { type: "json" }
import { CONTRACT_TYPES } from "../lib/constants"
import { renderIntro } from "../lib/utils"

const { name } = pkg

export default async function showChains() {
  renderIntro({
    badge: chalk.bgCyan(` ${name} `),
    title: "Available smart contract languages",
    iconColor: "cyanBright",
  })

  for (const contract of CONTRACT_TYPES) {
    const command = `npx w3docs init --${contract.value}`

    const line = contract.available
      ? [
          `${chalk.cyan("◆")} ${chalk.bold(contract.label)} ${chalk.gray("→")} ${chalk.white(contract.hint)}`,
          `  ${chalk.white("Command:")} ${chalk.cyan(command)}`,
        ].join("\n")
      : [
          `${chalk.gray("◆")} ${chalk.bold(contract.label)} ${chalk.gray("→")} ${chalk.gray(contract.hint)} ${chalk.gray("(coming soon)")}`,
          `  ${chalk.white("Command:")} ${chalk.gray(command)}`,
        ].join("\n")

    p.log.message(line)
  }

  p.outro(
    `${chalk.white("Try it now")} ${chalk.gray("→")} ${chalk.cyan(" npx w3docs init --sol ")}`
  )
}
