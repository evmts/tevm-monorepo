/**
 * @module @tevm/actions-effect/GetStorageAtService
 * @description Service tag for the GetStorageAt action handler (eth_getStorageAt)
 */
/**
 * Shape of the GetStorageAt service providing storage query capabilities
 * @typedef {Object} GetStorageAtShape
 * @property {(params: import('./types.js').GetStorageAtParams) => import('effect').Effect.Effect<
 *   `0x${string}`,
 *   import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError,
 *   never
 * >} getStorageAt - Get the storage value at a specific slot for an address
 */
/**
 * Service tag for GetStorageAt operations.
 * Provides access to contract storage queries with typed error handling.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetStorageAtService, GetStorageAtLive } from '@tevm/actions-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getStorageAt } = yield* GetStorageAtService
 *   const value = yield* getStorageAt({
 *     address: '0x1234567890123456789012345678901234567890',
 *     position: '0x0000000000000000000000000000000000000000000000000000000000000000'
 *   })
 *   console.log(`Storage value: ${value}`)
 *   return value
 * })
 *
 * // Run with the Live layer
 * Effect.runPromise(
 *   program.pipe(Effect.provide(GetStorageAtLive))
 * )
 * ```
 *
 */
export const GetStorageAtService: Context.Tag<any, any>;
/**
 * Shape of the GetStorageAt service providing storage query capabilities
 */
export type GetStorageAtShape = {
    /**
     * - Get the storage value at a specific slot for an address
     */
    getStorageAt: (params: import("./types.js").GetStorageAtParams) => import("effect").Effect.Effect<`0x${string}`, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
};
import { Context } from 'effect';
//# sourceMappingURL=GetStorageAtService.d.ts.map