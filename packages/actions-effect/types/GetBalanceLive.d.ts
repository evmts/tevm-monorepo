/**
 * Creates the GetBalance service implementation.
 *
 * This layer provides balance query functionality using the StateManagerService.
 * Implements the eth_getBalance JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetBalanceService, GetBalanceLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getBalance } = yield* GetBalanceService
 *   const balance = yield* getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return balance
 * })
 *
 * // Compose layers
 * const AppLayer = GetBalanceLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetBalanceLive: Layer.Layer<any, never, any>;
import { Layer } from 'effect';
//# sourceMappingURL=GetBalanceLive.d.ts.map