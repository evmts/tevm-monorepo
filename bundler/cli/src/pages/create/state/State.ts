import type { z } from "zod"
import type { args } from "../args.js"
import type { options } from "../options.js"

/**
 * UI state for the app
 */
export type State = {
  /**
   * Name of the project. Both the folder and the package name
   */
  name: (z.infer<typeof args>)[0]
  /**
   * Path to the project
   */
  path: (z.infer<typeof args>)[0]
  /**
   * The current displayed value of the name input
   */
  nameInput: string
  /**
   * Currently selected step
   */
  currentStep: number
} & z.infer<typeof options>
