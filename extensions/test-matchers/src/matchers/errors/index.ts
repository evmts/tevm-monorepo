import { toBeReverted } from './toBeReverted.js'

export { toBeReverted }

// TypeScript declaration for vitest
export interface ErrorMatchers {
	/**
	 * Assert that a transaction was reverted
	 */
	toBeReverted(): Promise<void>
}
