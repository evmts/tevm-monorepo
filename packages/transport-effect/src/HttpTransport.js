import { Effect, Layer, Schedule, Duration, Scope } from 'effect'
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
 * Default retry schedule for HTTP requests.
 * Retries up to 3 times with exponential backoff starting at 1 second.
 * @type {Schedule.Schedule<number, unknown, never>}
 */
const defaultRetrySchedule = Schedule.exponential(Duration.seconds(1)).pipe(
	Schedule.compose(Schedule.recurs(3))
)

/**
 * Default timeout for HTTP requests in milliseconds.
 * @type {number}
 */
const DEFAULT_TIMEOUT = 30000

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
					Effect.retry(retrySchedule),
					Effect.catchTag('ForkError', (e) => Effect.fail(e))
				)
			},
		})
	)
}
