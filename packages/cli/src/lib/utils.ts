import color, { type ColorName } from "chalk"
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
  const iconColored = (color[iconColor] || color.cyan)(icon)
  p.intro(`${iconColored} ${badge} ${color.dim("→")} ${color.white(title)}`)
}

/** Create a spinner with the same custom frames as before */
export function createSpinner() {
  return p.spinner({
    frames: ["⬒", "⬔", "⬓", "⬕"],
    styleFrame: (frame) => color.cyan(frame),
  })
}
