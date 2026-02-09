import fs from 'node:fs'
import type { EIP1193Parameters, EIP1193RequestFn, EIP1474Methods } from 'viem'
import { assert } from 'vitest'
import { resolveVitestTestSnapshotPath } from '../internal/resolveVitestTestSnapshotPath.js'

const sleep = (ms: number) => {
	// Use Atomics.wait for a tiny synchronous backoff while snapshot writes flush to disk.
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

/**
 * Get snapshot entries from the JSON snapshot format
 */
export const getSnapshotEntries = (): Record<string, any> => {
	const snapshotPath = resolveVitestTestSnapshotPath()
	if (!fs.existsSync(snapshotPath)) return {}
	for (let attempt = 0; attempt < 20; attempt++) {
		try {
			return JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'))
		} catch {
			if (attempt === 19) return {}
			sleep(20)
		}
	}
	return {}
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
): boolean => {
	const entries = getSnapshotEntries()
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

const waitForCacheState = (checker: () => boolean, expected: boolean, timeoutMs = 10_000): boolean => {
	const startedAt = Date.now()
	while (Date.now() - startedAt < timeoutMs) {
		const value = checker()
		if (value === expected) return value
		sleep(20)
	}
	return checker()
}

/**
 * Assert that a method is cached in the snapshot entries
 */
export const assertMethodCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: any) => boolean,
) => {
	const cached = waitForCacheState(() => isMethodCached(method, withParams), true)
	assert(cached, `${method} should be cached`)
}

/**
 * Assert that a method is not cached in the snapshot entries
 */
export const assertMethodNotCached = <TMethod extends EIP1193Parameters<EIP1474Methods>['method']>(
	method: TMethod,
	withParams?: (params: any) => boolean,
) => {
	const cached = waitForCacheState(() => isMethodCached(method, withParams), false)
	assert(!cached, `${method} should NOT be cached`)
}
