/**
 * @module nativeCustom
 *
 * Native custom transport function for wrapping any EIP-1193 provider.
 * This provides a viem-compatible custom() transport without requiring viem as a dependency.
 */

/**
 * @typedef {Object} CustomTransportConfig
 * @property {string} [key] - A unique key for the transport
 * @property {string} [name] - A human-readable name for the transport
 * @property {number} [retryCount] - Number of retry attempts (default: 3)
 * @property {number} [retryDelay] - Delay between retries in milliseconds (default: 150)
 */

/**
 * @typedef {Object} EIP1193Provider
 * @property {(args: {method: string, params?: unknown[]}) => Promise<unknown>} request - EIP-1193 request function
 */

/**
 * @typedef {Object} NativeCustomTransport
 * @property {(args: {method: string, params?: unknown[]}) => Promise<unknown>} request - EIP-1193 request function
 * @property {string} [key] - Transport key
 * @property {string} [name] - Transport name
 * @property {'custom'} type - Transport type
 */

/**
 * Creates a custom transport from an EIP-1193 provider.
 *
 * This is a native implementation compatible with viem's custom() transport,
 * allowing you to wrap any EIP-1193 compliant provider (like window.ethereum,
 * WalletConnect, or any other provider).
 *
 * @param {EIP1193Provider} provider - An EIP-1193 compliant provider object with a request method
 * @param {CustomTransportConfig} [config] - Optional transport configuration
 * @returns {() => NativeCustomTransport} A transport factory function
 *
 * @example
 * ```javascript
 * import { nativeCustom } from '@tevm/utils'
 *
 * // Wrap browser wallet provider
 * const transport = nativeCustom(window.ethereum)
 *
 * // Use with a memory client for forking
 * import { createMemoryClient } from '@tevm/memory-client'
 * const client = createMemoryClient({
 *   fork: {
 *     transport: nativeCustom(window.ethereum)
 *   }
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Wrap any EIP-1193 provider
 * const myProvider = {
 *   request: async ({ method, params }) => {
 *     // Custom implementation
 *     return fetch('/api/rpc', {
 *       method: 'POST',
 *       body: JSON.stringify({ method, params })
 *     }).then(r => r.json())
 *   }
 * }
 *
 * const transport = nativeCustom(myProvider, {
 *   key: 'my-custom',
 *   name: 'My Custom Provider'
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Migration from viem
 * // Before:
 * import { custom } from 'viem'
 * const transport = custom(window.ethereum)
 *
 * // After:
 * import { nativeCustom } from '@tevm/utils'
 * const transport = nativeCustom(window.ethereum)
 * ```
 */
export function nativeCustom(provider, config = {}) {
	if (!provider || typeof provider.request !== 'function') {
		throw new Error('nativeCustom requires an EIP-1193 provider with a request method')
	}

	return function createTransport() {
		/** @type {NativeCustomTransport} */
		const transport = {
			type: 'custom',
			key: config.key ?? 'custom',
			name: config.name ?? 'Custom Provider',
			/**
			 * EIP-1193 compliant request function with optional retry logic
			 * @param {{method: string, params?: unknown[]}} args
			 * @returns {Promise<unknown>}
			 */
			request: async (args) => {
				const maxRetries = config.retryCount ?? 3
				const retryDelay = config.retryDelay ?? 150
				let lastError

				for (let attempt = 0; attempt <= maxRetries; attempt++) {
					try {
						return await provider.request({
							method: args.method,
							params: args.params ?? [],
						})
					} catch (error) {
						lastError = error
						// Don't retry on certain errors (user rejection, invalid params, etc.)
						if (error && typeof error === 'object' && 'code' in error) {
							const code = /** @type {number} */ (error.code)
							// EIP-1193 error codes that shouldn't be retried
							if (code === 4001 || code === 4100 || code === 4200 || code === 4900 || code === 4901) {
								throw error
							}
							// JSON-RPC error codes that shouldn't be retried
							if (code === -32600 || code === -32601 || code === -32602 || code === -32700) {
								throw error
							}
						}

						// Wait before retrying (except on last attempt)
						if (attempt < maxRetries) {
							await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
						}
					}
				}

				throw lastError
			},
		}

		return transport
	}
}
