/**
 * Live implementation of TevmActionsService.
 *
 * Provides Effect-based wrappers around TEVM-specific operations.
 * This layer depends on:
 * - StateManagerService for state access
 * - VmService for execution
 * - GetAccountService for account queries
 * - SetAccountService for account mutations
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { TevmActionsService, TevmActionsLive } from '@tevm/decorators-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 *
 * const layer = TevmActionsLive.pipe(
 *   Layer.provide(StateManagerLocal()),
 *   Layer.provide(VmLive())
 * )
 *
 * const program = Effect.gen(function* () {
 *   const tevmActions = yield* TevmActionsService
 *   return yield* tevmActions.getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<TevmActionsService, never, StateManagerService | VmService | GetAccountService | SetAccountService>}
 */
export const TevmActionsLive: Layer.Layer<TevmActionsService, never, import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any> | import("effect/Context").Tag<any, any>>;
import { Layer } from 'effect';
import { TevmActionsService } from './TevmActionsService.js';
//# sourceMappingURL=TevmActionsLive.d.ts.map