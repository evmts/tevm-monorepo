/**
 * Live implementation of SendService.
 *
 * Provides JSON-RPC 2.0 compliant send methods by wrapping
 * the RequestService.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { SendService, SendLive } from '@tevm/decorators-effect'
 * import { RequestLive } from './RequestLive.js'
 *
 * const layer = SendLive.pipe(
 *   Layer.provide(RequestLive)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const sendService = yield* SendService
 *   return yield* sendService.send({
 *     jsonrpc: '2.0',
 *     method: 'eth_blockNumber',
 *     params: [],
 *     id: 1
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<SendService, never, RequestService>}
 */
export const SendLive: Layer.Layer<SendService, never, RequestService>;
import { Layer } from 'effect';
import { SendService } from './SendService.js';
import { RequestService } from './RequestService.js';
//# sourceMappingURL=SendLive.d.ts.map