import type { Step } from "./types.js"

export type InputStep = Step & {
  type: 'input'
}
export const nameStep = {
  type: 'input',
  prompt: 'What is the name of your project?',
  stateKey: 'name' as const,
} as const satisfies InputStep
