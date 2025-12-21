import type { EIP1193Parameters, EIP1474Methods, Transport } from 'viem'
import { type EIP1193RequestFn } from 'viem'
import { ethMethodToCacheKey } from '../internal/ethMethodToCacheKey.js'
import { isCachedJsonRpcMethod } from '../internal/isCachedJsonRpcMethod.js'
import { resolvePassthroughTransport, shouldBypassCache } from '../internal/resolvePassthroughTransport.js'
import type { PassthroughConfig, SnapshotAutosaveMode } from '../types.js'
import type { SnapshotManager } from './SnapshotManager.js'

// TODO: there is an issue where when using in tests createMemoryClient caches transports, so it might reuse a cached transport when creating a client with a non-cached transport (or the opposite)
// which will either ignore caching or might recreate cache entries on every run (e.g. when creating a memory client with 'latest' blocktag that reuses a cached transport)

/**
 * Creates a cached transport that wraps the original transport
 * and caches responses based on the request type. Supports passthrough
 * configuration for routing specific methods to different URLs.
 *
 * @param originalTransport - The original transport to wrap
 * @param snapshotManager - The snapshot manager instance
 * @param autosave - The autosave mode
 * @param passthroughConfig - Optional passthrough configuration for non-cached requests
 * @returns A wrapped transport that caches responses and handles passthrough routing
 */
export const createCachedTransport = <
	TTransportType extends string = string,
	TRpcAttributes = Record<string, any>,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
>(
	originalTransport: Transport<TTransportType, TRpcAttributes, TEip1193RequestFn> | { request: TEip1193RequestFn },
	snapshotManager: SnapshotManager,
	autosave: SnapshotAutosaveMode,
	passthroughConfig?: PassthroughConfig,
): { request: TEip1193RequestFn } => {
	const request = 'request' in originalTransport ? originalTransport.request : originalTransport({}).request

	return {
		request: async (_params, options) => {
			const params = _params as EIP1193Parameters<EIP1474Methods> & { jsonrpc: string }
			
			// Check if this method should use passthrough configuration
			if (passthroughConfig) {
				const passthroughTransport = resolvePassthroughTransport(params.method, params.params, passthroughConfig)
				
				// If we have a passthrough transport, use it
				if (passthroughTransport) {
					// Check if we should bypass caching entirely for this method
					if (shouldBypassCache(params.method, passthroughConfig)) {
						return passthroughTransport.request(params, options)
					}
					
					// Otherwise, use passthrough transport but still cache responses
					const cacheKey = ethMethodToCacheKey(params.method)(params)
					
					// Check if we have a cached response
					if (snapshotManager.has(cacheKey)) return snapshotManager.get(cacheKey)
					
					// Fetch from passthrough transport and cache the response
					const response = await passthroughTransport.request(params, options)
					snapshotManager.set(cacheKey, response)
					
					if (autosave === 'onRequest') await snapshotManager.save()
					
					return response
				}
			}
			
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
