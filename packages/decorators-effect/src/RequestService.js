/**
 * @module @tevm/decorators-effect/RequestService
 * Service definition for EIP-1193 request handling
 */

import { Context } from 'effect'

/**
 * Service tag for Request providing EIP-1193 compatible request handling.
 *
 * This service exposes the standard EIP-1193 `request` method for
 * JSON-RPC interactions.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { RequestService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const requestService = yield* RequestService
 *
 *   const blockNumber = yield* requestService.request({
 *     method: 'eth_blockNumber',
 *     params: []
 *   })
 *
 *   return blockNumber
 * })
 * ```
 *
 * @type {Context.Tag<RequestService, import('./types.js').RequestServiceShape>}
 */
export const RequestService = /** @type {Context.Tag<RequestService, import('./types.js').RequestServiceShape>} */ (
	Context.GenericTag('@tevm/decorators-effect/RequestService')
)

/**
 * @typedef {Context.Tag.Identifier<typeof RequestService>} RequestService
 */
