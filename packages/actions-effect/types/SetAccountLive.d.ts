/**
 * Creates the SetAccount service implementation.
 *
 * This layer provides account modification functionality using the StateManagerService.
 * It supports setting account balance, nonce, bytecode, and storage.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { SetAccountService, SetAccountLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { setAccount } = yield* SetAccountService
 *   yield* setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n,
 *   })
 * })
 *
 * // Compose layers
 * const AppLayer = SetAccountLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const SetAccountLive: Layer.Layer<any, never, any>;
import { Layer } from 'effect';
//# sourceMappingURL=SetAccountLive.d.ts.map