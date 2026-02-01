export type SendService = Context.Tag.Identifier<typeof SendService>;
/**
 * Service tag for Send providing JSON-RPC send methods.
 *
 * This service exposes:
 * - `send` - Send a single JSON-RPC request
 * - `sendBulk` - Send multiple JSON-RPC requests
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { SendService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const sendService = yield* SendService
 *
 *   const response = yield* sendService.send({
 *     jsonrpc: '2.0',
 *     method: 'eth_blockNumber',
 *     params: [],
 *     id: 1
 *   })
 *
 *   return response.result
 * })
 * ```
 *
 * @type {Context.Tag<SendService, import('./types.js').SendServiceShape>}
 */
export const SendService: any;
import { Context } from 'effect';
//# sourceMappingURL=SendService.d.ts.map