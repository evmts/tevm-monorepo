/**
 * @module @tevm/decorators-effect/EthActionsService
 * Service definition for Effect-based Ethereum actions
 */

import { Context } from 'effect'

/**
 * Service tag for EthActions providing standard Ethereum JSON-RPC methods.
 *
 * This service exposes common Ethereum operations like:
 * - `blockNumber` - Get current block number
 * - `call` - Execute eth_call
 * - `chainId` - Get chain ID
 * - `gasPrice` - Get current gas price
 * - `getBalance` - Get account balance
 * - `getCode` - Get contract code
 * - `getStorageAt` - Get storage value
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { EthActionsService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const ethActions = yield* EthActionsService
 *   const blockNumber = yield* ethActions.blockNumber()
 *   const chainId = yield* ethActions.chainId()
 *   return { blockNumber, chainId }
 * })
 * ```
 *
 * @type {Context.Tag<EthActionsService, import('./types.js').EthActionsShape>}
 */
export const EthActionsService = /** @type {Context.Tag<EthActionsService, import('./types.js').EthActionsShape>} */ (
	Context.GenericTag('@tevm/decorators-effect/EthActionsService')
)

/**
 * @typedef {Context.Tag.Identifier<typeof EthActionsService>} EthActionsService
 */
