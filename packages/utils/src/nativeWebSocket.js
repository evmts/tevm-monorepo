/**
 * @module nativeWebSocket
 *
 * Native WebSocket transport function using @tevm/voltaire's WebSocketProvider.
 * This provides a viem-compatible webSocket() transport without requiring viem as a dependency.
 */

import { WebSocketProvider } from '@tevm/voltaire/provider'

/**
 * @typedef {Object} WebSocketTransportConfig
 * @property {number} [timeout] - Request timeout in milliseconds (default: 30000)
 * @property {boolean} [reconnect] - Whether to automatically reconnect (default: true)
 * @property {number} [reconnectDelay] - Delay between reconnect attempts in milliseconds (default: 5000)
 * @property {number} [maxReconnectAttempts] - Maximum reconnect attempts, 0 for unlimited (default: 0)
 * @property {string|string[]} [protocols] - WebSocket sub-protocols
 */

/**
 * @typedef {Object} NativeWebSocketTransport
 * @property {(args: {method: string, params?: unknown[]}) => Promise<unknown>} request - EIP-1193 request function
 * @property {(method: string, params?: unknown[], callback?: (result: unknown) => void) => Promise<string>} subscribe - Subscribe to events
 * @property {(subscriptionId: string) => Promise<boolean>} unsubscribe - Unsubscribe from events
 * @property {() => Promise<void>} connect - Connect to WebSocket server
 * @property {() => void} disconnect - Disconnect from WebSocket server
 */

/**
 * Creates a WebSocket transport for JSON-RPC communication.
 *
 * This is a native implementation compatible with viem's webSocket() transport,
 * using @tevm/voltaire's WebSocketProvider internally.
 *
 * @param {string} url - The WebSocket endpoint URL (e.g., 'wss://mainnet.infura.io/ws/v3/...')
 * @param {WebSocketTransportConfig} [config] - Optional transport configuration
 * @returns {() => NativeWebSocketTransport} A transport factory function
 *
 * @example
 * ```javascript
 * import { nativeWebSocket } from '@tevm/utils'
 *
 * // Basic usage - identical API to viem's webSocket()
 * const transport = nativeWebSocket('wss://mainnet.infura.io/ws/v3/YOUR_KEY')()
 *
 * // Connect to WebSocket server
 * await transport.connect()
 *
 * // Make requests
 * const blockNumber = await transport.request({ method: 'eth_blockNumber' })
 *
 * // Subscribe to events
 * const subscriptionId = await transport.subscribe('newHeads', [], (block) => {
 *   console.log('New block:', block)
 * })
 *
 * // Unsubscribe when done
 * await transport.unsubscribe(subscriptionId)
 *
 * // Disconnect
 * transport.disconnect()
 * ```
 *
 * @example
 * ```javascript
 * // With configuration
 * const transport = nativeWebSocket('wss://mainnet.infura.io/ws/v3/YOUR_KEY', {
 *   timeout: 60000,
 *   reconnect: true,
 *   reconnectDelay: 3000,
 *   maxReconnectAttempts: 5
 * })()
 *
 * await transport.connect()
 * ```
 *
 * @example
 * ```javascript
 * // Migration from viem
 * // Before:
 * import { webSocket } from 'viem'
 * const transport = webSocket('wss://mainnet.infura.io/ws/v3/YOUR_KEY')
 *
 * // After:
 * import { nativeWebSocket } from '@tevm/utils'
 * const transport = nativeWebSocket('wss://mainnet.infura.io/ws/v3/YOUR_KEY')
 * ```
 */
export function nativeWebSocket(url, config = {}) {
	return function createTransport() {
		/** @type {Record<string, unknown>} */
		const providerOptions = {
			url,
			reconnect: config.reconnect ?? true,
			reconnectDelay: config.reconnectDelay ?? 5000,
			maxReconnectAttempts: config.maxReconnectAttempts ?? 0,
		}
		if (config.protocols !== undefined) {
			providerOptions['protocols'] = config.protocols
		}
		const provider = new WebSocketProvider(/** @type {any} */ (providerOptions))

		/** @type {Map<string, ((result: unknown) => void)[]>} */
		const subscriptionCallbacks = new Map()

		return {
			/**
			 * Connect to WebSocket server
			 * @returns {Promise<void>}
			 */
			connect: async () => {
				return provider.connect()
			},

			/**
			 * Disconnect from WebSocket server
			 */
			disconnect: () => {
				provider.disconnect()
			},

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

			/**
			 * Subscribe to WebSocket events
			 * @param {string} method - Subscription method (e.g., 'newHeads', 'logs', 'newPendingTransactions')
			 * @param {unknown[]} [params] - Subscription parameters
			 * @param {(result: unknown) => void} [callback] - Callback for subscription events
			 * @returns {Promise<string>} Subscription ID
			 */
			subscribe: async (method, params = [], callback) => {
				// @ts-ignore - subscribe is public in voltaire but typed as private
				const subscriptionId = await provider.subscribe(method, params)
				if (callback && subscriptionId) {
					const existing = subscriptionCallbacks.get(subscriptionId) ?? []
					existing.push(callback)
					subscriptionCallbacks.set(subscriptionId, existing)
					// Register callback with provider
					provider.on(subscriptionId, callback)
				}
				return subscriptionId
			},

			/**
			 * Unsubscribe from WebSocket events
			 * @param {string} subscriptionId - The subscription ID to unsubscribe
			 * @returns {Promise<boolean>} Whether unsubscription was successful
			 */
			unsubscribe: async (subscriptionId) => {
				// @ts-ignore - unsubscribe is public in voltaire but typed as private
				const result = await provider.unsubscribe(subscriptionId)
				subscriptionCallbacks.delete(subscriptionId)
				return result
			},
		}
	}
}
