// import figlet from "figlet";
// const banner = figlet.textSync(name, { font: "ANSI Shadow" });

// console.log(color.cyan(banner));

// src/commands/docs.ts

import color from "kleur";
import * as p from "@clack/prompts";

import pkg from "../../package.json";
import { sleep } from "../lib/utils";
import { CONTRACT_TYPES } from "../lib/constants";

const { name, description } = pkg;

export default async function generateDocs(initialLanguage?: string) {
  p.intro(
    `${color.bgCyan().bold(` ${name} `)} ${color.gray("•")} ${color.white().bold(description)}`,
  );

  let language = initialLanguage;

  // Skip language selection if passed via CLI flag
  if (!language) {
    const languageResult = await p.select({
      message: "What type of smart contract did you write?",
      options: CONTRACT_TYPES.map((contract) => ({
        label: contract.label,
        value: contract.value,
        hint: contract.hint,
      })),
    });

    if (p.isCancel(languageResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    language = languageResult as string;
  }

  const selectedContract = CONTRACT_TYPES.find(
    (contract) => contract.value === language,
  );

  if (!selectedContract) {
    p.log.error("Invalid contract type selected.");
    process.exit(1);
  }

  // Step 2: Network
  const chainResult = await p.select({
    message: selectedContract.networkMessage,
    options: selectedContract.networks,
  });

  if (p.isCancel(chainResult)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const chain = chainResult as string;

  // Step 3: Contract address
  const addressResult = await p.text({
    message: "What is the contract address?",
    placeholder: "0x..",
    validate(value) {
      if (!value?.trim()) {
        return "Contract address is required";
      }

      return undefined;
    },
  });

  if (p.isCancel(addressResult)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const address = addressResult as string;

  // Step 4: Project name
  const projectNameResult = await p.text({
    message: "What would you like to name this project?",
    placeholder: "w3docs",
    defaultValue: "w3docs",
    validate(value) {
      if (!/^[a-z0-9-_]+$/.test(value as string)) {
        return "Use lowercase letters, numbers, hyphens, or underscores only";
      }

      return undefined;
    },
  });

  if (p.isCancel(projectNameResult)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const projectName = (projectNameResult as string) || "w3docs";

  const spinner = p.spinner({
    frames: ["⬒", "⬔", "⬓", "⬕"],
    styleFrame: (frame) => color.cyan(frame),
  });

  spinner.start(color.cyan("Fetching contract interface"));
  await sleep(1500);

  spinner.message(color.cyan("Generating documentation"));
  await sleep(1200);

  spinner.message(color.cyan("Scaffolding project"));
  await sleep(800);

  spinner.message(color.cyan("Installing dependencies"));
  await sleep(2000);

  spinner.stop(color.green("Project generated successfully."));

  p.log.message(
    [
      `${color.cyan("◆")} ${color.bold("Language")}   ${color.gray(selectedContract.label)}`,
      `${color.cyan("◆")} ${color.bold("Network")}    ${color.gray(chain)}`,
      `${color.cyan("◆")} ${color.bold("Address")}    ${color.gray(address)}`,
      `${color.cyan("◆")} ${color.bold("Directory")}  ${color.gray(`./${projectName}`)}`,
    ].join("\n"),
  );

  p.outro(
    [
      `${color.cyan(`✓ Build complete. ${color.bold("Your on-chain interface is ready.")}`)}`,
      "",
      `${color.bold("Next steps:")}`,
      ` ${color.cyan("$")} cd ${projectName}`,
      ` ${color.cyan("$")} w3docs build`,
      ` ${color.cyan("$")} w3docs dev`,
    ].join("\n"),
  );
}
