import type { args } from '../args.js'
import type { options } from '../options.js'
import type { z } from 'zod'

export type Page = 'interactive' | 'creating' | 'complete'

/**
 * UI state for the app
 */
export type State = {
	/**
	 * Name of the project. Both the folder and the package name
	 */
	name: z.infer<typeof args>[0]
	/**
	 * Path to the project
	 */
	path: z.infer<typeof args>[0]
	/**
	 * The current displayed value of the name input
	 */
	nameInput: string
	/*
	 * The current displayed value of the walletCOnnectId input
	 */
	walletConnectIdInput: string
	/**
	 * Currently selected step on the interactive prompt
	 */
	currentStep: number
	/**
	 * Currently selected page
	 */
	currentPage: Page
} & z.infer<typeof options>
