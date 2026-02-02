/**
 * Creates the GetCode service implementation.
 *
 * This layer provides contract bytecode query functionality using the StateManagerService.
 * Implements the eth_getCode JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetCodeService, GetCodeLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getCode } = yield* GetCodeService
 *   const code = yield* getCode({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return code
 * })
 *
 * // Compose layers
 * const AppLayer = GetCodeLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 */
export const GetCodeLive: Layer.Layer<any, never, any>;
import { Layer } from 'effect';
//# sourceMappingURL=GetCodeLive.d.ts.map