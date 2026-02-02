/**
 * Creates the GetStorageAt service implementation.
 *
 * This layer provides storage query functionality using the StateManagerService.
 * Implements the eth_getStorageAt JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetStorageAtService, GetStorageAtLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getStorageAt } = yield* GetStorageAtService
 *   const value = yield* getStorageAt({
 *     address: '0x1234567890123456789012345678901234567890',
 *     position: '0x0'
 *   })
 *   return value
 * })
 *
 * // Compose layers
 * const AppLayer = GetStorageAtLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetStorageAtLive: Layer.Layer<any, never, any>;
import { Layer } from 'effect';
//# sourceMappingURL=GetStorageAtLive.d.ts.map