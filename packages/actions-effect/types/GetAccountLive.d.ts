/**
 * Creates the GetAccount service implementation.
 *
 * This layer provides account query functionality using the StateManagerService.
 * It supports querying account balance, nonce, bytecode, and storage.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetAccountService, GetAccountLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getAccount } = yield* GetAccountService
 *   const account = yield* getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return account
 * })
 *
 * // Compose layers
 * const AppLayer = GetAccountLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetAccountLive: Layer.Layer<any, never, any>;
import { Layer } from 'effect';
//# sourceMappingURL=GetAccountLive.d.ts.map