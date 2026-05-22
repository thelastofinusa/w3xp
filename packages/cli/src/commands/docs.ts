import path from "path"
import color from "chalk"
import fs from "fs-extra"
import figlet from "figlet"
import * as p from "@clack/prompts"

import pkg from "../../package.json" with { type: "json" }
import { CONTRACT_TYPES } from "../lib/constants.js"
import { scaffoldProject } from "../lib/scaffold.js"
import { createSpinner, renderIntro } from "../lib/utils.js"

const { name, description } = pkg

export default async function generateDocs(initialLanguage?: string) {
  const banner = figlet.textSync(name, { font: "ANSI Shadow" })
  console.log(color.cyan(banner))

  try {
    renderIntro({
      badge: `Welcome to ${color.bgCyan(` ${name} `)}`,
      title: description,
      iconColor: "cyan",
    })

    let language = initialLanguage

    // Skip language selection if passed via CLI flag
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

    // Step 2: Network
    const chainResult = await p.select({
      message: selectedContract.networkMessage,
      options: selectedContract.networks,
    })

    if (p.isCancel(chainResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    const chain = chainResult as string

    // Step 3: Contract address
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

    // Step 4: Project name
    const projectNameResult = await p.text({
      message: "What would you like to name this project?",
      placeholder: "w3docs",
      defaultValue: "w3docs",
    })

    if (p.isCancel(projectNameResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    // Step 4: Project name
    let rawName = (projectNameResult as string)?.trim() || "w3docs"
    let targetDir: string
    let displayName: string

    // Resolve the initial target
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
      // When targetDir is the current directory, check if it's empty
      if (targetDir === process.cwd()) {
        const files = fs.readdirSync(targetDir).filter(
          (f) => !f.startsWith(".") || f === ".git" // allow .git if present, otherwise ignore dotfiles
        )
        if (files.length === 0) break // empty dir – fine to use
      }

      const action = await p.select({
        message: `Directory ${color.redBright(displayName)} already exists. What would you like to do?`,
        options: [
          {
            label: "Overwrite",
            value: "overwrite",
            hint: "delete and recreate",
          },
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
        break // directory no longer exists, proceed
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
        // Loop continues – it will check the new directory
      }
    }

    // Now targetDir either didn't exist or has been cleared
    const spinner = createSpinner()
    spinner.start(color.cyan("Generating documentation project"))

    try {
      await scaffoldProject({
        targetDir,
        displayName,
        chain,
        address,
        verified: true,
        title: displayName,
        language: selectedContract?.label,
        spinner,
      })
    } catch (error: any) {
      spinner.stop(color.red("Failed"))
      p.log.error(error.message)
      process.exit(1)
    }
  } catch (error: any) {
    p.outro(color.red(error.message))
    process.exit(1)
  }
}
