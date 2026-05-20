#!/usr/bin/env node

import color from "kleur";
import { Command } from "commander";

import pkg from "../package.json";
import generateDocs from "./commands/docs";
import showChains from "./commands/show";
import { CONTRACT_TYPES } from "./lib/constants";

const { name, version, description } = pkg;

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version, "-v, --version", "output the version number");

program
  .command("show")
  .description("show supported smart contract languages and chains")
  .action(async () => showChains());

const generateCommand = program
  .command("init")
  .description("initialize smart contract documentation");

// Dynamically register flags
for (const contract of CONTRACT_TYPES) {
  generateCommand.option(
    `--${contract.value}`,
    `generate documentation for ${color.cyan().bold(contract.label)} contracts`,
  );
}

generateCommand.action(async (options) => {
  const selectedLanguage = CONTRACT_TYPES.find(
    (contract) => options[contract.value],
  );

  await generateDocs(selectedLanguage?.value);
});

if (process.argv.length <= 2) {
  console.clear();
  program.help();
} else {
  console.clear();
  program.parse();
}
