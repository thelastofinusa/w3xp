import color from "chalk"
import pkg from "../../package.json" with { type: "json" }
import { CONTRACT_TYPES } from "../lib/constants.js"
import { renderIntro } from "../lib/utils.js"

const { name } = pkg

export default async function showChains() {
  renderIntro({
    badge: color.bgCyan(` ${name} `),
    title: "Available smart contract languages",
    iconColor: "cyanBright",
  })

  for (const contract of CONTRACT_TYPES) {
    const command = `npx w3docs init --${contract.value}`

    const line = contract.available
      ? [
          `${color.cyan("◆")} ${color.bold(contract.label)} ${color.gray("→")} ${color.white(contract.hint)}`,
          `  ${color.white("Command:")} ${color.cyan(command)}`,
        ].join("\n")
      : [
          `${color.gray("◆")} ${color.bold(contract.label)} ${color.gray("→")} ${color.gray(contract.hint)} ${color.gray("(coming soon)")}`,
          `  ${color.white("Command:")} ${color.gray(command)}`,
        ].join("\n")

    console.log(line)
  }

  console.log(
    `${color.white("Try it now")} ${color.gray("→")} ${color.cyan(" npx w3docs init --sol ")}`
  )
}
