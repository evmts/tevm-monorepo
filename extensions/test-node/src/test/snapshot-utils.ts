import fs from 'node:fs'
import path from 'node:path'
import { getCurrentTestFile } from '../internal/getCurrentTestFile.js'
import { SnapshotManager } from '../snapshot/SnapshotManager.js'
import type { EIP1193RequestFn } from 'viem'

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
 * Create a mock transport for testing
 */
export const createMockTransport = (responses: Record<string, any> = {}): { request: EIP1193RequestFn } => {
	return {
		request: async (params) => {
			const key = JSON.stringify(['2.0', params.method, ...(Array.isArray(params.params) ? params.params : [])])
			if (key in responses) return responses[key]
			throw new Error(`Unexpected request: ${params.method}`)
		},
	}
}
