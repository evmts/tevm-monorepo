import { Context } from 'effect'

/**
 * @module @tevm/actions-effect/GetAccountService
 * @description Service tag for the GetAccount action handler
 */

/**
 * Shape of the GetAccount service providing account query capabilities
 * @typedef {Object} GetAccountShape
 * @property {(params: import('./types.js').GetAccountParams) => import('effect').Effect.Effect<
 *   import('./types.js').GetAccountSuccess,
 *   import('@tevm/errors-effect').AccountNotFoundError | import('@tevm/errors-effect').StateRootNotFoundError | import('@tevm/errors-effect').InvalidParamsError,
 *   never
 * >} getAccount - Get account information for an address
 */

/**
 * Service tag for GetAccount operations.
 * Provides access to account state queries with typed error handling.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetAccountService, GetAccountLive } from '@tevm/actions-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getAccount } = yield* GetAccountService
 *   const result = yield* getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   console.log(`Balance: ${result.balance}`)
 *   return result
 * })
 *
 * // Run with the Live layer
 * Effect.runPromise(
 *   program.pipe(Effect.provide(GetAccountLive))
 * )
 * ```
 *
 * @type {Context.Tag<GetAccountService, GetAccountShape>}
 */
export const GetAccountService = Context.GenericTag(
	/** @type {const} */ ('@tevm/actions-effect/GetAccountService'),
)

/**
 * @typedef {Context.Tag.Identifier<typeof GetAccountService>} GetAccountService
 */
