import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "evm/index": "src/evm/index.ts",
    "types/index": "src/types/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
})
