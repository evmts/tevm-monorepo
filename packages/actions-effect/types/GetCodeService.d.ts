/**
 * @module @tevm/actions-effect/GetCodeService
 * @description Service tag for the GetCode action handler (eth_getCode)
 */
/**
 * Shape of the GetCode service providing contract code query capabilities
 * @typedef {Object} GetCodeShape
 * @property {(params: import('./types.js').GetCodeParams) => import('effect').Effect.Effect<
 *   `0x${string}`,
 *   import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError,
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
 */
export const GetCodeService: Context.Tag<any, any>;
/**
 * Shape of the GetCode service providing contract code query capabilities
 */
export type GetCodeShape = {
    /**
     * - Get the bytecode deployed at an address
     */
    getCode: (params: import("./types.js").GetCodeParams) => import("effect").Effect.Effect<`0x${string}`, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
};
import { Context } from 'effect';
//# sourceMappingURL=GetCodeService.d.ts.map