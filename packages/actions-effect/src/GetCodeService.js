import { Context } from 'effect'

/**
 * @module @tevm/actions-effect/GetCodeService
 * @description Service tag for the GetCode action handler (eth_getCode)
 */

/**
 * Shape of the GetCode service providing contract code query capabilities
 * @typedef {Object} GetCodeShape
 * @property {(params: import('./types.js').GetCodeParams) => import('effect').Effect.Effect<
 *   `0x${string}`,
 *   import('@tevm/errors-effect').InvalidParamsError,
 *   never
 * >} getCode - Get the bytecode deployed at an address
 */

/**
 * Service tag for GetCode operations.
 * Provides access to contract bytecode queries with typed error handling.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetCodeService, GetCodeLive } from '@tevm/actions-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getCode } = yield* GetCodeService
 *   const code = yield* getCode({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   console.log(`Contract code: ${code}`)
 *   return code
 * })
 *
 * // Run with the Live layer
 * Effect.runPromise(
 *   program.pipe(Effect.provide(GetCodeLive))
 * )
 * ```
 *
 * @type {Context.Tag<GetCodeService, GetCodeShape>}
 */
export const GetCodeService = Context.GenericTag(
	/** @type {const} */ ('@tevm/actions-effect/GetCodeService'),
)

/**
 * @typedef {Context.Tag.Identifier<typeof GetCodeService>} GetCodeService
 */
