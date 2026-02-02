/**
 * Live implementation of RequestService.
 *
 * Provides EIP-1193 compatible request handling by routing
 * JSON-RPC methods to the appropriate action services.
 *
 * Supports:
 * - Standard Ethereum methods (eth_*)
 * - TEVM-specific methods (tevm_*)
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { RequestService, RequestLive } from '@tevm/decorators-effect'
 * import { EthActionsLive } from './EthActionsLive.js'
 * import { TevmActionsLive } from './TevmActionsLive.js'
 *
 * const layer = RequestLive.pipe(
 *   Layer.provide(EthActionsLive),
 *   Layer.provide(TevmActionsLive)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const requestService = yield* RequestService
 *   return yield* requestService.request({
 *     method: 'eth_blockNumber',
 *     params: []
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<RequestService, never, EthActionsService | TevmActionsService>}
 */
export const RequestLive: Layer.Layer<RequestService, never, EthActionsService | TevmActionsService>;
import { Layer } from 'effect';
import { RequestService } from './RequestService.js';
import { EthActionsService } from './EthActionsService.js';
import { TevmActionsService } from './TevmActionsService.js';
//# sourceMappingURL=RequestLive.d.ts.map