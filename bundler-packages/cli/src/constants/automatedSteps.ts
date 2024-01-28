import type { Step } from './types.js'

export type AutomatedStep = Step & {
	type: 'automated'
	loadingMessage: string
	successMessage: string
}

export const creatingProject = {
	type: 'automated',
	prompt: 'Creating project',
	stateKey: 'creatingProject' as const,
	loadingMessage: 'Creating project',
	successMessage: 'Project created',
} as const satisfies AutomatedStep

export const initializingGit = {
	type: 'automated',
	prompt: 'Initializing git',
	stateKey: 'initializingGit' as const,
	loadingMessage: 'Initializing git',
	successMessage: 'Git initialized',
} as const satisfies AutomatedStep

export const installingDependencies = {
	type: 'automated',
	prompt: 'Installing dependencies',
	stateKey: 'installingDependencies' as const,
	loadingMessage: 'Installing dependencies',
	successMessage: 'Dependencies installed',
} as const satisfies AutomatedStep
