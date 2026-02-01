/**
 * @module @tevm/transport-effect/TransportShape
 * @description Interface definition for the TransportService shape
 */

/**
 * @typedef {import('./types.js').TransportShape} TransportShape
 */

/**
 * The TransportShape interface defines the contract for RPC transport services.
 *
 * This interface is used to make JSON-RPC requests to Ethereum nodes,
 * supporting forking functionality in TEVM.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { TransportService } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *
 *   // Get the current chain ID
 *   const chainIdHex = yield* transport.request('eth_chainId')
 *   const chainId = BigInt(chainIdHex)
 *
 *   // Get the current block number
 *   const blockNumberHex = yield* transport.request('eth_blockNumber')
 *   const blockNumber = BigInt(blockNumberHex)
 *
 *   return { chainId, blockNumber }
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Making a call with parameters
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *
 *   const balance = yield* transport.request('eth_getBalance', [
 *     '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
 *     'latest'
 *   ])
 *
 *   return BigInt(balance)
 * })
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/transport-effect/interfaces/transportshape/ TransportShape documentation}
 */

export {}
