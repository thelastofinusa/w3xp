import chalk, { type ColorName } from "chalk"
import * as p from "@clack/prompts"

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

type IntroOptions = {
  title: string
  badge?: string
  icon?: string
  iconColor?: ColorName
}

export function renderIntro({
  title,
  badge = "w3docs",
  icon = "⬒",
  iconColor = "cyan",
}: IntroOptions) {
  const iconColored = (chalk[iconColor] || chalk.cyan)(icon)
  p.intro(`${iconColored} ${badge} ${chalk.dim("→")} ${chalk.white(title)}`)
}

/** Create a spinner with the same custom frames as before */
export function createSpinner(
  colorOrGetter: ColorName | (() => ColorName) = "cyan"
) {
  return p.spinner({
    frames: ["⬒", "⬔", "⬓", "⬕"],
    styleFrame: (frame) => {
      const c =
        typeof colorOrGetter === "function" ? colorOrGetter() : colorOrGetter
      const fn = chalk[c] as (text: string) => string
      return fn(frame)
    },
  })
}
