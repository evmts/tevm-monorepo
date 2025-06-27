import type { Transport } from 'viem'
import type { Hex } from 'viem'
import { numberToHex } from 'viem'
import { isCachedMethod } from '../internal/isCachedMethod.js'
import { normalizeJsonRpcRequest } from '../internal/normalizeJsonRpcRequest.js'
import type { SnapshotManager } from './SnapshotManager.js'

/**
 * Creates a cached transport that wraps the original transport
 * and caches responses based on the request type
 * 
 * @param originalTransport - The original transport to wrap
 * @param snapshotManager - The snapshot manager instance
 * @param chainId - The chain ID for cache key generation
 * @returns A wrapped transport that caches responses
 */
export const createCachedTransport = (
	originalTransport: Transport,
	snapshotManager: SnapshotManager,
	chainId?: Hex
): Transport => {
	// We need to get the actual transport function
	const transportFn = typeof originalTransport === 'function' ? originalTransport : originalTransport.request

	// Create a wrapper transport
	const cachedTransport: Transport = async (config) => {
		// Get the underlying transport
		const transport = typeof transportFn === 'function' ? await transportFn(config) : transportFn

		// Store the original request method
		const originalRequest = transport.request

		// Override the request method
		transport.request = async (params: any) => {
			// Serialize the request to check if it should be cached
			const body = JSON.stringify(params)
			
			// Check if this method should be cached
			if (!isCachedMethod(body)) {
				// Not cacheable, pass through to original
				return originalRequest(params)
			}

			// Get or determine chain ID if not provided
			let effectiveChainId = chainId
			if (!effectiveChainId) {
				try {
					effectiveChainId = (await originalRequest({ method: 'eth_chainId' })) as Hex
				} catch {
					// If we can't get chain ID, don't cache
					return originalRequest(params)
				}
			}

			// Generate cache key
			const cacheKey = normalizeJsonRpcRequest(effectiveChainId, body)

			// Check if we have a cached response
			if (snapshotManager.has(cacheKey)) {
				const cachedResponse = snapshotManager.get(cacheKey)
				return cachedResponse
			}

			// No cached response, fetch from original transport
			try {
				const response = await originalRequest(params)
				
				// Cache the response (but don't save to disk yet)
				snapshotManager.set(cacheKey, response)
				
				return response
			} catch (error) {
				// Don't cache errors, just propagate them
				throw error
			}
		}

		return transport
	}

	// Copy over any properties from the original transport
	if (typeof originalTransport === 'object' && originalTransport !== null) {
		Object.assign(cachedTransport, originalTransport)
	}

	return cachedTransport as Transport
}