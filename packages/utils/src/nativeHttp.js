/**
 * @module nativeHttp
 *
 * Native HTTP transport function using @tevm/voltaire's HttpProvider.
 * This provides a viem-compatible http() transport without requiring viem as a dependency.
 */

import { HttpProvider } from '@tevm/voltaire/provider'

/**
 * @typedef {Object} HttpTransportConfig
 * @property {number} [timeout] - Request timeout in milliseconds (default: 30000)
 * @property {number} [retryCount] - Number of retry attempts (default: 3)
 * @property {number} [retryDelay] - Delay between retries in milliseconds (default: 1000)
 * @property {Record<string, string>} [headers] - Additional HTTP headers
 */

/**
 * @typedef {Object} NativeHttpTransport
 * @property {(args: {method: string, params?: unknown[]}) => Promise<unknown>} request - EIP-1193 request function
 */

/**
 * Creates an HTTP transport for JSON-RPC communication.
 *
 * This is a native implementation compatible with viem's http() transport,
 * using @tevm/voltaire's HttpProvider internally.
 *
 * @param {string} url - The JSON-RPC endpoint URL
 * @param {HttpTransportConfig} [config] - Optional transport configuration
 * @returns {() => NativeHttpTransport} A transport factory function
 *
 * @example
 * ```javascript
 * import { nativeHttp } from '@tevm/utils'
 * import { createMemoryClient } from '@tevm/memory-client'
 *
 * // Basic usage - identical API to viem's http()
 * const client = createMemoryClient({
 *   fork: {
 *     transport: nativeHttp('https://mainnet.optimism.io')
 *   }
 * })
 *
 * // With configuration
 * const clientWithConfig = createMemoryClient({
 *   fork: {
 *     transport: nativeHttp('https://mainnet.optimism.io', {
 *       timeout: 60000,
 *       retryCount: 5,
 *       headers: {
 *         'Authorization': 'Bearer token'
 *       }
 *     })
 *   }
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Migration from viem
 * // Before:
 * import { http } from 'viem'
 * const transport = http('https://mainnet.optimism.io')
 *
 * // After:
 * import { nativeHttp } from '@tevm/utils'
 * const transport = nativeHttp('https://mainnet.optimism.io')
 * ```
 */
export function nativeHttp(url, config = {}) {
	return function createTransport() {
		/** @type {import('@tevm/voltaire/provider').HttpProviderOptions} */
		const providerOptions = {
			url,
			timeout: config.timeout ?? 30000,
			retry: config.retryCount ?? 3,
			retryDelay: config.retryDelay ?? 1000,
		}
		if (config.headers) {
			providerOptions.headers = config.headers
		}
		const provider = new HttpProvider(providerOptions)

		return {
			/**
			 * EIP-1193 compliant request function
			 * @param {{method: string, params?: unknown[]}} args
			 * @returns {Promise<unknown>}
			 */
			request: async (args) => {
				return provider.request({
					method: args.method,
					params: args.params ?? [],
				})
			},
		}
	}
}
