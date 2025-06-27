import fs from 'node:fs'
import path from 'node:path'
import { SnapshotManager } from '../snapshot/SnapshotManager.js'
import { getCurrentTestFile } from '../core/getCurrentTestFile.js'

/**
 * Get snapshot entries from the new JSON snapshot format
 */
export const getSnapshotEntries = (cacheDir?: string): Record<string, any> => {
	const testFileName = getCurrentTestFile()
	const baseDir = cacheDir ?? SnapshotManager.defaultCacheDir
	const snapshotPath = path.join(baseDir, testFileName, 'snapshots.json')

	if (!fs.existsSync(snapshotPath)) {
		return {}
	}

	const content = fs.readFileSync(snapshotPath, 'utf-8')
	return JSON.parse(content)
}

/**
 * Clean up snapshot directory for tests
 */
export const cleanupSnapshots = (cacheDir?: string): void => {
	const testFileName = getCurrentTestFile()
	const baseDir = cacheDir ?? SnapshotManager.defaultCacheDir
	const snapshotDir = path.join(baseDir, testFileName)

	if (fs.existsSync(snapshotDir)) {
		fs.rmSync(snapshotDir, { recursive: true, force: true })
	}
}

/**
 * Create a mock transport for testing
 */
export const createMockTransport = (responses: Record<string, any> = {}) => {
	return () => ({
		request: async (params: any) => {
			const key = `${params.method}:${JSON.stringify(params.params)}`
			if (key in responses) {
				return responses[key]
			}
			// Default responses for common methods
			if (params.method === 'eth_chainId') {
				return '0x1'
			}
			throw new Error(`Unexpected request: ${params.method}`)
		}
	})
}