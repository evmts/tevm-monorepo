export type TevmActionsService = Context.Tag.Identifier<typeof TevmActionsService>;
/**
 * Service tag for TevmActions providing TEVM-specific operations.
 *
 * This service exposes TEVM-specific operations like:
 * - `call` - Execute TEVM call with advanced options
 * - `getAccount` - Get detailed account state
 * - `setAccount` - Set account state
 * - `dumpState` - Dump entire VM state
 * - `loadState` - Load previously dumped state
 * - `mine` - Mine blocks
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { TevmActionsService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const tevmActions = yield* TevmActionsService
 *
 *   // Set up account
 *   yield* tevmActions.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n
 *   })
 *
 *   // Get account state
 *   const account = yield* tevmActions.getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *
 *   return account
 * })
 * ```
 *
 * @type {Context.Tag<TevmActionsService, import('./types.js').TevmActionsShape>}
 */
export const TevmActionsService: any;
import { Context } from 'effect';
//# sourceMappingURL=TevmActionsService.d.ts.map