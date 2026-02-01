/**
 * @module @tevm/actions-effect/SetAccountService
 * @description Service tag for the SetAccount action handler
 */
/**
 * Shape of the SetAccount service providing account modification capabilities
 * @typedef {Object} SetAccountShape
 * @property {(params: import('./types.js').SetAccountParams) => import('effect').Effect.Effect<
 *   import('./types.js').SetAccountSuccess,
 *   import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError,
 *   never
 * >} setAccount - Set account state for an address
 */
/**
 * Service tag for SetAccount operations.
 * Provides ability to modify account state including balance, nonce, bytecode, and storage.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { SetAccountService, SetAccountLive } from '@tevm/actions-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { setAccount } = yield* SetAccountService
 *   yield* setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n, // 1 ETH
 *     nonce: 0n,
 *   })
 *   console.log('Account updated')
 * })
 *
 * // Run with the Live layer
 * Effect.runPromise(
 *   program.pipe(Effect.provide(SetAccountLive))
 * )
 * ```
 *
 */
export const SetAccountService: Context.Tag<any, any>;
/**
 * Shape of the SetAccount service providing account modification capabilities
 */
export type SetAccountShape = {
    /**
     * - Set account state for an address
     */
    setAccount: (params: import("./types.js").SetAccountParams) => import("effect").Effect.Effect<import("./types.js").SetAccountSuccess, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
};
import { Context } from 'effect';
//# sourceMappingURL=SetAccountService.d.ts.map