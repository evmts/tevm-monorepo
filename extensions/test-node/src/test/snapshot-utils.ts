import fs from 'node:fs'
import path from 'node:path'
import type { EIP1193Parameters, EIP1193RequestFn, EIP1474Methods } from 'viem'
import { assert } from 'vitest'
import { getCurrentTestFile } from '../internal/getCurrentTestFile.js'
import { SnapshotManager } from '../snapshot/SnapshotManager.js'

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

/**
 * Check if a method is cached in the snapshot entries
 */
const isMethodCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: any) => boolean,
	cacheDir?: string,
): boolean => {
	const entries = getSnapshotEntries(cacheDir)
	return Object.keys(entries).some((key) => {
		try {
			const parsedKey = JSON.parse(key)
			const keyMethod = Array.isArray(parsedKey) && parsedKey.length >= 2 ? parsedKey[1] : null

			if (keyMethod !== method) return false

			if (withParams && Array.isArray(parsedKey) && parsedKey.length > 2) {
				const params = parsedKey.slice(2)
				return withParams(params as any)
			}

			return true
		} catch {
			return false
		}
	})
}

/**
 * Assert that a method is cached in the snapshot entries
 */
export const assertMethodCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: any) => boolean,
	cacheDir?: string,
) => {
	const cached = isMethodCached(method, withParams, cacheDir)
	assert(cached, `${method} should be cached`)
}

/**
 * Assert that a method is not cached in the snapshot entries
 */
export const assertMethodNotCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: any) => boolean,
	cacheDir?: string,
) => {
	const cached = isMethodCached(method, withParams, cacheDir)
	assert(!cached, `${method} should NOT be cached`)
}
