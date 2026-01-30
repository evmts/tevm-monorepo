import { Context } from 'effect'

/**
 * @module @tevm/transport-effect/TransportService
 * @description Effect.ts Context.Tag for the TransportService
 */

/**
 * @typedef {import('./types.js').TransportShape} TransportShape
 */

/**
 * The TransportService Context.Tag for Effect.ts dependency injection.
 *
 * This service provides a type-safe interface for making JSON-RPC requests
 * to Ethereum nodes. It is primarily used for forking functionality, allowing
 * TEVM to fetch remote state from a live network.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { TransportService, HttpTransport } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *
 *   // Get chain ID from remote node
 *   const chainIdHex = yield* transport.request('eth_chainId')
 *   console.log('Chain ID:', BigInt(chainIdHex))
 *
 *   // Get account balance
 *   const balance = yield* transport.request('eth_getBalance', [
 *     '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
 *     'latest'
 *   ])
 *   console.log('Balance:', BigInt(balance))
 * })
 *
 * // Run with HTTP transport
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(HttpTransport({ url: 'https://mainnet.optimism.io' }))
 *   )
 * )
 * ```
 *
 * @example
 * ```javascript
 * // Using TransportNoop for non-fork mode
 * import { TransportNoop } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *   // This will fail with ForkError since no transport is configured
 *   const result = yield* transport.request('eth_chainId')
 * })
 *
 * Effect.runPromise(
 *   program.pipe(Effect.provide(TransportNoop))
 * ).catch(console.error)
 * ```
 *
 * @type {Context.Tag<TransportService, TransportShape>}
 */
export const TransportService = /** @type {Context.Tag<TransportService, TransportShape>} */ (
	Context.GenericTag('TransportService')
)
