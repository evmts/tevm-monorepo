import type { Step } from './types.js'

/**
 * A cli step where user enters input text
 */
export type InputStep = Step & {
	type: 'input'
}

/**
 * Name of the project
 */
export const nameStep = {
	type: 'input',
	prompt: 'What is the name of your project?',
	stateKey: 'name' as const,
} as const satisfies InputStep

/**
 * Comma seperated list of chainIds used by the project
 */
export const walletConnectProjectId = {
	type: 'input',
	prompt:
		'Please enter your wallet connect project id. See https://docs.walletconnect.com/cloud/relay#project-id',
	stateKey: 'walletConnectProjectId' as const,
} as const satisfies InputStep
