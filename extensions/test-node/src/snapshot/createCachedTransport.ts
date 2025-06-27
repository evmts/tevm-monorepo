import type { Transport } from 'viem'
import { type EIP1193RequestFn } from 'viem'
import { isCachedMethod } from '../internal/isCachedMethod.js'
import type { SnapshotManager } from './SnapshotManager.js'
import { ethMethodToCacheKey } from '../internal/ethMethodToCacheKey.js'
import type { EthJsonRpcRequest } from '@tevm/actions'

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
			// If it's not a cached method, pass through to original
			if (!isCachedMethod(_params)) return request(_params, options)
			const params = _params as EthJsonRpcRequest

			// Generate cache key
			// @ts-expect-error - this goes away in next PR when we use a function instead of an object
			const cacheKey = ethMethodToCacheKey[params.method as keyof typeof ethMethodToCacheKey]?.(params) ?? ''

			// Check if we have a cached response
			if (snapshotManager.has(cacheKey)) return snapshotManager.get(cacheKey)

			// Otherwise fetch and cache the response
			const response = await request(params, options)
			snapshotManager.set(cacheKey, response)

			return response
		},
	}
}
