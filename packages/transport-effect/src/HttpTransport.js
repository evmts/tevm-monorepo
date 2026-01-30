import { Effect, Layer, Schedule, Duration } from 'effect'
import { ForkError } from '@tevm/errors-effect'
import { TransportService } from './TransportService.js'

/**
 * @module @tevm/transport-effect/HttpTransport
 * @description HTTP transport layer for making JSON-RPC requests to Ethereum nodes
 */

/**
 * @typedef {import('./types.js').TransportShape} TransportShape
 * @typedef {import('./types.js').HttpTransportConfig} HttpTransportConfig
 */

/**
 * Default timeout for HTTP requests in milliseconds.
 * @type {number}
 */
const DEFAULT_TIMEOUT = 30000

/**
 * Checks if an error is a transient network error that should be retried.
 * Only retries network failures, timeouts, and server errors (5xx).
 * Does NOT retry semantic RPC errors like "insufficient funds" or "nonce too low".
 *
 * @param {ForkError} error - The error to check
 * @returns {boolean} - True if the error should be retried
 */
const isRetryableError = (error) => {
	// Get the error message from either the cause or the error itself
	// Using explicit conditionals for better coverage tracking
	let message = ''
	if (error.cause && error.cause.message) {
		message = error.cause.message
	} else if (error.message) {
		message = error.message
	}
	message = message.toLowerCase()

	// Retry on network errors
	if (
		message.includes('fetch failed') ||
		message.includes('network') ||
		message.includes('econnrefused') ||
		message.includes('econnreset') ||
		message.includes('etimedout') ||
		message.includes('enotfound') ||
		message.includes('socket hang up')
	) {
		return true
	}

	// Retry on timeout/abort errors
	if (message.includes('abort') || message.includes('timeout')) {
		return true
	}

	// Retry on HTTP 5xx server errors
	if (message.includes('http error: 5')) {
		return true
	}

	// Retry on rate limiting (429)
	if (message.includes('http error: 429') || message.includes('rate limit')) {
		return true
	}

	// Do NOT retry semantic RPC errors (insufficient funds, nonce issues, revert, etc.)
	return false
}

/**
 * Creates an HTTP transport layer for making JSON-RPC requests to Ethereum nodes.
 *
 * This transport is used for forking functionality, allowing TEVM to fetch
 * remote state from a live Ethereum network. It includes automatic retry
 * with exponential backoff and configurable timeouts.
 *
 * @param {HttpTransportConfig} config - The transport configuration
 * @returns {Layer.Layer<TransportService, never, never>} A Layer providing TransportService
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { TransportService, HttpTransport } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *
 *   // Get chain ID
 *   const chainIdHex = yield* transport.request('eth_chainId')
 *   console.log('Chain ID:', BigInt(chainIdHex))
 *
 *   // Get latest block number
 *   const blockNumberHex = yield* transport.request('eth_blockNumber')
 *   console.log('Block number:', BigInt(blockNumberHex))
 *
 *   // Get account balance
 *   const balance = yield* transport.request('eth_getBalance', [
 *     '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
 *     'latest'
 *   ])
 *   console.log('Balance:', BigInt(balance))
 * })
 *
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(HttpTransport({
 *       url: 'https://mainnet.optimism.io',
 *       timeout: 30000,
 *       retryCount: 3,
 *       retryDelay: 1000
 *     }))
 *   )
 * )
 * ```
 *
 * @example
 * ```javascript
 * // With custom headers (e.g., for authentication)
 * const transport = HttpTransport({
 *   url: 'https://your-node.example.com',
 *   headers: {
 *     'Authorization': 'Bearer your-api-key'
 *   }
 * })
 * ```
 */
export const HttpTransport = (config) => {
	const timeout = config.timeout ?? DEFAULT_TIMEOUT
	const retryCount = config.retryCount ?? 3
	const retryDelay = config.retryDelay ?? 1000

	const retrySchedule = Schedule.exponential(Duration.millis(retryDelay)).pipe(
		Schedule.compose(Schedule.recurs(retryCount))
	)

	return Layer.succeed(
		TransportService,
		/** @type {TransportShape} */ ({
			request: (method, params) => {
				return Effect.tryPromise({
					try: async () => {
						const controller = new AbortController()
						const timeoutId = setTimeout(() => controller.abort(), timeout)

						try {
							const response = await fetch(config.url, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									...config.headers,
								},
								body: JSON.stringify({
									jsonrpc: '2.0',
									id: Date.now(),
									method,
									params: params ?? [],
								}),
								signal: controller.signal,
							})

							if (!response.ok) {
								throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
							}

							const json = /** @type {{ result?: unknown; error?: { message: string; code: number } }} */ (
								await response.json()
							)

							if (json.error) {
								throw new Error(`RPC error: ${json.error.message} (code: ${json.error.code})`)
							}

							return json.result
						} finally {
							clearTimeout(timeoutId)
						}
					},
					catch: (error) =>
						new ForkError({
							method,
							cause: error instanceof Error ? error : new Error(String(error)),
						}),
				}).pipe(
					Effect.retry({
						schedule: retrySchedule,
						while: isRetryableError,
					})
				)
			},
		})
	)
}
