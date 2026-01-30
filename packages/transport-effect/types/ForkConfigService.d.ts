/**
 * @module @tevm/transport-effect/ForkConfigService
 * @description Effect.ts Context.Tag for the ForkConfigService
 */
/**
 * @typedef {import('./types.js').ForkConfigShape} ForkConfigShape
 */
/**
 * The ForkConfigService Context.Tag for Effect.ts dependency injection.
 *
 * This service provides the fork configuration (chain ID and block tag) needed
 * to fork from a remote Ethereum network. Use ForkConfigFromRpc to automatically
 * fetch the configuration from an RPC endpoint, or ForkConfigStatic to provide
 * explicit values.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { ForkConfigService, ForkConfigFromRpc, HttpTransport } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *
 *   console.log('Chain ID:', forkConfig.chainId)
 *   console.log('Block number:', forkConfig.blockTag)
 *
 *   return forkConfig
 * })
 *
 * // Use with RPC-fetched configuration
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(ForkConfigFromRpc),
 *     Effect.provide(HttpTransport({ url: 'https://mainnet.optimism.io' }))
 *   )
 * )
 * ```
 *
 * @example
 * ```javascript
 * // Use with static configuration (useful for testing)
 * import { ForkConfigStatic } from '@tevm/transport-effect'
 *
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(ForkConfigStatic({
 *       chainId: 1n,
 *       blockTag: 18000000n
 *     }))
 *   )
 * )
 * ```
 */
export const ForkConfigService: Context.Tag<any, any>;
export type ForkConfigShape = import("./types.js").ForkConfigShape;
import { Context } from 'effect';
//# sourceMappingURL=ForkConfigService.d.ts.map