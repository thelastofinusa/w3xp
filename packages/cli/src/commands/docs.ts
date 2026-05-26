// 0x2ad9172920b27074476EB7ae1963B84CE55ea1f1
import path from "path"
import chalk from "chalk"
import fs from "fs-extra"
import figlet from "figlet"
import * as p from "@clack/prompts"
import { fetchEVMContract } from "@w3docs/core/evm"
import { CONTRACT_TYPES } from "../lib/constants"
import { scaffoldProject } from "../lib/scaffold"
import { createSpinner, renderIntro } from "../lib/utils"
import pkg from "../../package.json" with { type: "json" }

export default async function generateDocs(initialLanguage?: string) {
  const banner = figlet.textSync(pkg.name, { font: "ANSI Shadow" })
  console.log(chalk.greenBright(banner))

  try {
    renderIntro({
      badge: `Welcome to ${chalk.bgGreenBright(` ${pkg.name} `)} v${pkg.version}`,
      title: "Let's generate some docs!",
      iconColor: "greenBright",
    })

    let language = initialLanguage

    if (!language) {
      const languageResult = await p.select({
        message: "What type of smart contract did you write?",
        options: CONTRACT_TYPES.map((contract) => ({
          label: contract.label,
          value: contract.value,
          hint: contract.hint,
        })),
      })
      if (p.isCancel(languageResult)) {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }
      language = languageResult as string
    }

    const selectedContract = CONTRACT_TYPES.find(
      (contract) => contract.value === language
    )
    if (!selectedContract) {
      p.log.error("Invalid contract type selected.")
      process.exit(1)
    }

    if (!selectedContract.available) {
      p.log.warn(
        chalk.yellow(
          `Support for ${chalk.bold(selectedContract.label)} contracts is coming soon. Stay tuned!`
        )
      )
      process.exit(1)
    }

    // Network selection
    const chainResult = await p.select({
      message: selectedContract.networkMessage,
      options: selectedContract.networks,
      maxItems: 20,
    })
    if (p.isCancel(chainResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }
    let chain = chainResult as string

    if (chain === "custom") {
      const customChainId = await p.text({
        message: "Enter the EVM chain ID (e.g., 43114 for Avalanche C-Chain):",
        placeholder: "43114",
        validate(value) {
          const num = Number(value)
          if (!value?.trim() || isNaN(num) || num <= 0)
            return "Please enter a valid positive chain ID"
          return undefined
        },
      })
      if (p.isCancel(customChainId)) {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }
      chain = (customChainId as string).trim()
    }

    // Contract address
    const addressResult = await p.text({
      message: "What is the contract address?",
      placeholder: "0x..",
      validate(value) {
        if (!value?.trim()) return "Contract address is required"
        return undefined
      },
    })
    if (p.isCancel(addressResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }
    const address = addressResult as string

    // Project name
    const projectNameResult = await p.text({
      message: "What would you like to name this project?",
      placeholder: "w3docs",
      defaultValue: "w3docs",
    })
    if (p.isCancel(projectNameResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    let rawName = (projectNameResult as string)?.trim() || "w3docs"
    let targetDir: string
    let displayName: string

    const resolveDir = (name: string) => {
      if (name === "." || name === "./") {
        return {
          targetDir: process.cwd(),
          displayName: path.basename(process.cwd()),
        }
      }
      return {
        targetDir: path.resolve(process.cwd(), name),
        displayName: name,
      }
    }
    ;({ targetDir, displayName } = resolveDir(rawName))

    // Conflict resolution loop
    while (fs.existsSync(targetDir)) {
      if (targetDir === process.cwd()) {
        const files = fs
          .readdirSync(targetDir)
          .filter((f) => !f.startsWith("."))
        if (files.length === 0) break
      }

      const isCurrentDir = targetDir === process.cwd()
      const action = await p.select({
        message: `Directory ${chalk.bgRed(` ${displayName} `)} already exists. What would you like to do?`,
        options: [
          ...(isCurrentDir
            ? []
            : [
                {
                  label: "Overwrite",
                  value: "overwrite",
                  hint: "delete and recreate",
                },
              ]),
          { label: "Rename", value: "rename", hint: "choose a new name" },
          { label: "Cancel", value: "cancel", hint: "exit without changes" },
        ],
      })
      if (p.isCancel(action) || action === "cancel") {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }
      if (action === "overwrite") {
        fs.removeSync(targetDir)
        break
      }
      if (action === "rename") {
        const newName = await p.text({
          message: "Enter a new project name:",
          placeholder: "w3docs",
          validate(value) {
            if (!value?.trim()) return "Project name is required"
            return undefined
          },
        })
        if (p.isCancel(newName)) {
          p.cancel("Operation cancelled.")
          process.exit(0)
        }
        rawName = (newName as string).trim() || "w3docs"
        const resolved = resolveDir(rawName)
        targetDir = resolved.targetDir
        displayName = resolved.displayName
      }
    }

    // -------- Fetch contract data --------
    const spinner = createSpinner()
    let contractData: string | undefined
    let rawAbi: string | undefined
    let contractName = displayName

    spinner.start(chalk.cyan("Fetching contract metadata"))
    try {
      const result = await fetchEVMContract(chain, address)

      contractData = JSON.stringify(result.contract, null, 2)
      rawAbi = JSON.stringify(result.rawAbi, null, 2)
      contractName = result.contract.name
      spinner.stop(chalk.green("Contract metadata retrieved"))
    } catch (error: any) {
      spinner.error(
        chalk.red(
          error instanceof Error
            ? error.message
            : "Failed to fetch contract metadata"
        )
      )

      const useSample = await p.confirm({
        message: "No verified ABI found. Use sample data instead?",
      })
      if (p.isCancel(useSample) || !useSample) {
        p.log.error(chalk.red("Aborting. Verify the contract and try again."))
        process.exit(1)
      }
      p.log.warn(
        chalk.yellow(
          "Using sample contract data – the explorer will show demo content."
        )
      )
    }

    // -------- Scaffold the project --------
    try {
      await scaffoldProject({
        targetDir,
        displayName,
        chain,
        address,
        verified: true,
        title: contractName,
        language: selectedContract?.label,
        contractData,
        rawAbi,
      })
    } catch (error: any) {
      p.log.error(chalk.red("Failed to create project: " + error.message))
      process.exit(1)
    }
  } catch (error: any) {
    p.outro(chalk.red(error.message))
    process.exit(1)
  }
}
