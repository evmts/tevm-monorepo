import type { EIP1193Parameters, EIP1474Methods, Transport } from 'viem'
import { type EIP1193RequestFn } from 'viem'
import { ethMethodToCacheKey } from '../internal/ethMethodToCacheKey.js'
import { isCachedJsonRpcMethod } from '../internal/isCachedJsonRpcMethod.js'
import type { PassthroughMethodsFilter, SnapshotAutosaveMode } from '../types.js'
import type { SnapshotManager } from './SnapshotManager.js'

/**
 * Checks if a method should be passed through (bypass cache)
 * @param method - The RPC method name
 * @param passthroughMethods - Array of method names or filter function
 * @returns true if the method should bypass the cache
 */
const isPassthroughMethod = (
	method: string,
	passthroughMethods: string[] | PassthroughMethodsFilter | undefined,
): boolean => {
	if (!passthroughMethods) return false
	if (Array.isArray(passthroughMethods)) {
		return passthroughMethods.includes(method)
	}
	return passthroughMethods(method)
}

/**
 * Creates a cached transport that wraps the original transport
 * and caches responses based on the request type
 *
 * @param originalTransport - The original transport to wrap
 * @param snapshotManager - The snapshot manager instance
 * @param autosave - The autosave mode
 * @param passthroughMethods - Optional array of method names or filter function for methods that should bypass cache
 * @returns A wrapped transport that caches responses
 */
export const createCachedTransport = <
	TTransportType extends string = string,
	TRpcAttributes = Record<string, any>,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
>(
	originalTransport: Transport<TTransportType, TRpcAttributes, TEip1193RequestFn> | { request: TEip1193RequestFn },
	snapshotManager: SnapshotManager,
	autosave: SnapshotAutosaveMode,
	passthroughMethods?: string[] | PassthroughMethodsFilter,
): { request: TEip1193RequestFn } => {
	const request = 'request' in originalTransport ? originalTransport.request : originalTransport({}).request

	return {
		request: async (_params, options) => {
			const params = _params as EIP1193Parameters<EIP1474Methods> & { jsonrpc: string }

			// If method is in passthrough list, bypass cache completely
			if (isPassthroughMethod(params.method, passthroughMethods)) return request(params, options)

			// If it's not a cached method, pass through to original
			if (!isCachedJsonRpcMethod(params)) return request(params, options)

			// Generate cache key
			const cacheKey = ethMethodToCacheKey(params.method)(params)

			// Check if we have a cached response
			if (snapshotManager.has(cacheKey)) return snapshotManager.get(cacheKey)

			// Otherwise fetch and cache the response
			const response = await request(params, options)
			snapshotManager.set(cacheKey, response)

			if (autosave === 'onRequest') await snapshotManager.save()

			return response
		},
	} as { request: TEip1193RequestFn }
}
