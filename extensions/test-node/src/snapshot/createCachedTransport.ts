import type { EIP1193Parameters, EIP1474Methods, Transport } from 'viem'
import { type EIP1193RequestFn } from 'viem'
import { ethMethodToCacheKey } from '../internal/ethMethodToCacheKey.js'
import { isCachedJsonRpcMethod } from '../internal/isCachedJsonRpcMethod.js'
import type { SnapshotManager } from './SnapshotManager.js'

/**
 * Creates a cached transport that wraps the original transport
 * and caches responses based on the request type
 *
 * @param originalTransport - The original transport to wrap
 * @param snapshotManager - The snapshot manager instance
 * @returns A wrapped transport that caches responses
 */
export const createCachedTransport = (
	originalTransport: Transport | { request: EIP1193RequestFn },
	snapshotManager: SnapshotManager,
): { request: EIP1193RequestFn } => {
	const request = 'request' in originalTransport ? originalTransport.request : originalTransport({}).request

	return {
		request: async (_params, options) => {
			const params = _params as EIP1193Parameters<EIP1474Methods> & { jsonrpc: string }
			// If it's not a cached method, pass through to original
			if (!isCachedJsonRpcMethod(params)) return request(params, options)

			// Generate cache key
			const cacheKey = ethMethodToCacheKey(params.method)(params)

			// Check if we have a cached response
			if (snapshotManager.has(cacheKey)) return snapshotManager.get(cacheKey)

			// Otherwise fetch and cache the response
			const response = await request(params, options)
			snapshotManager.set(cacheKey, response)

			return response
		},
	}
}
