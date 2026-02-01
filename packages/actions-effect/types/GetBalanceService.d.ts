/**
 * @module @tevm/actions-effect/GetBalanceService
 * @description Service tag for the GetBalance action handler (eth_getBalance)
 */
/**
 * Shape of the GetBalance service providing balance query capabilities
 * @typedef {Object} GetBalanceShape
 * @property {(params: import('./types.js').GetBalanceParams) => import('effect').Effect.Effect<
 *   bigint,
 *   import('@tevm/errors-effect').InvalidParamsError | import('@tevm/errors-effect').InternalError,
 *   never
 * >} getBalance - Get the balance of an address
 */
/**
 * Service tag for GetBalance operations.
 * Provides access to account balance queries with typed error handling.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetBalanceService, GetBalanceLive } from '@tevm/actions-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getBalance } = yield* GetBalanceService
 *   const balance = yield* getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   console.log(`Balance: ${balance} wei`)
 *   return balance
 * })
 *
 * // Run with the Live layer
 * Effect.runPromise(
 *   program.pipe(Effect.provide(GetBalanceLive))
 * )
 * ```
 *
 */
export const GetBalanceService: Context.Tag<any, any>;
/**
 * Shape of the GetBalance service providing balance query capabilities
 */
export type GetBalanceShape = {
    /**
     * - Get the balance of an address
     */
    getBalance: (params: import("./types.js").GetBalanceParams) => import("effect").Effect.Effect<bigint, import("@tevm/errors-effect").InvalidParamsError | import("@tevm/errors-effect").InternalError, never>;
};
import { Context } from 'effect';
//# sourceMappingURL=GetBalanceService.d.ts.map