import { ForkError } from '@tevm/errors-effect'
import { Chunk, Deferred, Duration, Effect, Fiber, Layer, Queue, Ref, Schedule } from 'effect'
import { TransportService } from './TransportService.js'

/**
 * @module @tevm/transport-effect/HttpTransport
 * @description HTTP transport layer for making JSON-RPC requests to Ethereum nodes
 */

/**
 * @typedef {import('./types.js').TransportShape} TransportShape
 * @typedef {import('./types.js').HttpTransportConfig} HttpTransportConfig
 * @typedef {import('./types.js').BatchConfig} BatchConfig
 */

/**
 * Default timeout for HTTP requests in milliseconds.
 * @type {number}
 */
const DEFAULT_TIMEOUT = 30000

/**
 * A pending batch request with its deferred result
 * @typedef {Object} PendingRequest
 * @property {number} id - The JSON-RPC request id
 * @property {string} method - The RPC method
 * @property {unknown[]} params - The RPC params
 * @property {Deferred.Deferred<unknown, ForkError>} deferred - The deferred to resolve/reject
 */

/**
 * Checks if an error is a transient network error that should be retried.
 * Only retries network failures, timeouts, and server errors (5xx).
 * Does NOT retry semantic RPC errors like "insufficient funds" or "nonce too low".
 *
 * @param {ForkError} error - The error to check
 * @returns {boolean} - True if the error should be retried
 */
const isRetryableError = (error) => {
	// Get the error message from the cause
	// ForkError always has a cause that is an Error with a message string
	// (see catch handler in createSingleRequest and sendBatch)
	const cause = /** @type {Error} */ (error.cause)
	const message = cause.message.toLowerCase()

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
 * Creates a single request effect (non-batched behavior)
 *
 * @param {HttpTransportConfig} config - The transport configuration
 * @param {number} timeout - Request timeout in milliseconds
 * @param {Schedule.Schedule<unknown, ForkError>} retrySchedule - Retry schedule
 * @returns {(method: string, params?: unknown[]) => Effect.Effect<unknown, ForkError>}
 */
const createSingleRequest = (config, timeout, retrySchedule) => {
	return (method, params) => {
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
			}),
		)
	}
}

/**
 * Sends a batch of requests to the RPC endpoint and resolves each deferred
 *
 * This function includes retry logic for transient network errors (timeouts, 5xx, etc.).
 * Retries are applied at the HTTP request level, so the same batch with the same Deferreds
 * is retried immediately on failure, rather than creating new Deferreds.
 *
 * @param {HttpTransportConfig} config - The transport configuration
 * @param {number} timeout - Request timeout in milliseconds
 * @param {PendingRequest[]} batch - The batch of pending requests (must be non-empty)
 * @param {Schedule.Schedule<unknown, ForkError>} retrySchedule - Retry schedule for transient errors
 * @returns {Effect.Effect<void, never>}
 */
const sendBatch = (config, timeout, batch, retrySchedule) => {
	return Effect.gen(function* () {
		const requests = batch.map((req) => ({
			jsonrpc: '2.0',
			id: req.id,
			method: req.method,
			params: req.params,
		}))

		// HTTP request with retry logic applied at this level
		// This ensures the same batch is retried with the same Deferreds
		const httpRequest = Effect.tryPromise({
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
						body: JSON.stringify(requests),
						signal: controller.signal,
					})

					if (!response.ok) {
						throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
					}

					const json =
						/** @type {Array<{ id: number; result?: unknown; error?: { message: string; code: number } }>} */ (
							await response.json()
						)

					return json
				} finally {
					clearTimeout(timeoutId)
				}
			},
			catch: (error) =>
				new ForkError({
					method: 'batch',
					cause: error instanceof Error ? error : new Error(String(error)),
				}),
		}).pipe(
			// Apply retry logic HERE at the HTTP request level
			// This ensures the same batch is retried immediately on transient failures
			Effect.retry({
				schedule: retrySchedule,
				while: isRetryableError,
			}),
		)

		const result = yield* Effect.either(httpRequest)

		if (result._tag === 'Left') {
			// All retries exhausted - now fail the Deferreds
			// Create individual ForkErrors with each request's method name
			const batchError = result.left
			for (const req of batch) {
				yield* Deferred.fail(
					req.deferred,
					new ForkError({
						method: req.method,
						cause: batchError.cause,
					}),
				)
			}
			return
		}

		// Create a map of id -> response for fast lookup
		const responses = result.right
		/** @type {Map<number, { result?: unknown; error?: { message: string; code: number } }>} */
		const responseMap = new Map()
		for (const resp of responses) {
			responseMap.set(resp.id, resp)
		}

		// Resolve each request with its corresponding response
		for (const req of batch) {
			const resp = responseMap.get(req.id)
			if (!resp) {
				yield* Deferred.fail(
					req.deferred,
					new ForkError({
						method: req.method,
						cause: new Error(`No response found for request id ${req.id}`),
					}),
				)
			} else if (resp.error) {
				yield* Deferred.fail(
					req.deferred,
					new ForkError({
						method: req.method,
						cause: new Error(`RPC error: ${resp.error.message} (code: ${resp.error.code})`),
					}),
				)
			} else {
				yield* Deferred.succeed(req.deferred, resp.result)
			}
		}
	})
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
 *
 * @example
 * ```javascript
 * // With batching enabled - requests are batched together
 * const transport = HttpTransport({
 *   url: 'https://mainnet.optimism.io',
 *   batch: {
 *     wait: 10,    // Wait 10ms to accumulate requests
 *     maxSize: 20  // Send batch when 20 requests accumulated
 *   }
 * })
 *
 * // Multiple concurrent requests will be batched into a single HTTP call
 * const [balance, code, nonce] = await Effect.runPromise(
 *   Effect.all([
 *     transport.request('eth_getBalance', [address, 'latest']),
 *     transport.request('eth_getCode', [address, 'latest']),
 *     transport.request('eth_getTransactionCount', [address, 'latest'])
 *   ]).pipe(Effect.provide(transport))
 * )
 * ```
 */
export const HttpTransport = (config) => {
	const timeout = config.timeout ?? DEFAULT_TIMEOUT
	const retryCount = config.retryCount ?? 3
	const retryDelay = config.retryDelay ?? 1000

	const retrySchedule = Schedule.exponential(Duration.millis(retryDelay)).pipe(
		Schedule.compose(Schedule.recurs(retryCount)),
	)

	// If no batch config, use simple Layer.succeed for non-batched transport
	if (!config.batch) {
		const singleRequest = createSingleRequest(config, timeout, retrySchedule)
		return Layer.succeed(
			TransportService,
			/** @type {TransportShape} */ ({
				request: singleRequest,
			}),
		)
	}

	// Batched transport with proper resource management
	const batchConfig = config.batch

	return Layer.scoped(
		TransportService,
		Effect.gen(function* () {
			// Counter for unique request IDs
			const idCounter = yield* Ref.make(0)

			// Queue to hold pending requests
			/** @type {Queue.Queue<PendingRequest>} */
			const pendingQueue = yield* Queue.unbounded()

			// Deferred that is completed when a batch should be sent (by timer or maxSize)
			/** @type {Ref.Ref<Deferred.Deferred<void, never> | null>} */
			const batchTriggerRef = yield* Ref.make(/** @type {Deferred.Deferred<void, never> | null} */ (null))

			// Flag to track if we're shutting down (for batch processor loop termination)
			const isShuttingDown = yield* Ref.make(false)

			/**
			 * Process and send the current batch of requests
			 * @returns {Effect.Effect<void, never>}
			 */
			const processBatch = Effect.gen(function* () {
				// Take all available requests from the queue (up to maxSize)
				const batchChunk = yield* Queue.takeUpTo(pendingQueue, batchConfig.maxSize)
				const batch = Chunk.toArray(batchChunk)

				if (batch.length > 0) {
					// Pass retrySchedule so sendBatch can retry the HTTP request itself
					yield* sendBatch(config, timeout, batch, retrySchedule)
				}
			})

			// Start a background fiber that processes batches when triggered
			const batchProcessor = Effect.gen(function* () {
				while (true) {
					// Check if we're shutting down
					const shuttingDown = yield* Ref.get(isShuttingDown)
					if (shuttingDown) {
						// Process any remaining before exiting
						yield* processBatch
						return
					}

					// Create a new trigger deferred
					const trigger = yield* Deferred.make()
					yield* Ref.set(batchTriggerRef, trigger)

					// Wait for either the trigger or a timeout
					yield* Effect.race(Deferred.await(trigger), Effect.sleep(Duration.millis(batchConfig.wait)))

					// Clear the trigger
					yield* Ref.set(batchTriggerRef, null)

					// Process the batch
					yield* processBatch
				}
			})

			// Fork the batch processor
			const processorFiber = yield* Effect.fork(batchProcessor)

			// Clean up function for layer teardown
			yield* Effect.acquireRelease(Effect.void, () =>
				Effect.gen(function* () {
					// Mark as shutting down
					yield* Ref.set(isShuttingDown, true)

					// Trigger the processor to wake up and finish
					const trigger = yield* Ref.get(batchTriggerRef)
					if (trigger) {
						yield* Deferred.succeed(trigger, undefined)
					}

					// Wait for processor to finish
					yield* Fiber.join(processorFiber)

					// Shutdown the queue
					yield* Queue.shutdown(pendingQueue)
				}),
			)

			/** @type {TransportShape} */
			const transport = {
				request: /** @type {TransportShape['request']} */ (
					(method, params) => {
						return Effect.gen(function* () {
							// Issue #315 fix: Check if transport is shutting down before accepting new requests
							// This prevents race condition where requests are added to queue after processor exits
							const shuttingDown = yield* Ref.get(isShuttingDown)
							/* v8 ignore start - defensive code only runs during layer teardown race condition */
							if (shuttingDown) {
								return yield* Effect.fail(
									new ForkError({
										method,
										cause: new Error('Transport is shutting down - cannot accept new requests'),
									}),
								)
							}
							/* v8 ignore stop */

							// Create unique ID for this request
							const id = yield* Ref.updateAndGet(idCounter, (n) => n + 1)

							// Create deferred for this request
							const deferred = /** @type {Deferred.Deferred<unknown, ForkError>} */ (
								/** @type {unknown} */ (yield* Deferred.make())
							)

							// Add to pending queue
							/** @type {PendingRequest} */
							const pendingRequest = {
								id,
								method,
								params: params ?? [],
								deferred,
							}

							// Add to pending queue
							yield* Queue.offer(pendingQueue, pendingRequest)

							// Check if we should trigger batch immediately (queue size >= maxSize)
							const queueSize = yield* Queue.size(pendingQueue)
							if (queueSize >= batchConfig.maxSize) {
								// Trigger immediate batch processing
								const trigger = yield* Ref.get(batchTriggerRef)
								if (trigger) {
									yield* Deferred.succeed(trigger, undefined)
								}
							}

							// Wait for the result
							// Note: Retry logic is now in sendBatch at the HTTP request level,
							// not here. Retrying here would create new Deferreds on each retry,
							// requiring a wait for the next batch cycle instead of immediate retry.
							return yield* Deferred.await(deferred)
						})
					}
				),
			}

			return transport
		}),
	)
}
