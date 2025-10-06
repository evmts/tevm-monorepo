import path from 'node:path'

/**
 * Reliably determines the current test file name using Vitest's internal state
 */
export const getCurrentTestFile = (): string => {
	// @ts-expect-error - accessing Vitest internals
	const vitestFilePath = globalThis.__vitest_worker__?.filepath
	if (!vitestFilePath) throw new Error('Could not find test file name from vitest worker')
	return path.basename(vitestFilePath)
}
