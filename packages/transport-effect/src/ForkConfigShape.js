/**
 * @module @tevm/transport-effect/ForkConfigShape
 * @description Interface definition for the ForkConfigService shape
 */

/**
 * @typedef {import('./types.js').ForkConfigShape} ForkConfigShape
 */

/**
 * The ForkConfigShape interface defines the fork configuration for TEVM.
 *
 * This interface holds the chain ID and block tag for forking from a remote network.
 * It is used by other services to determine which chain to fork from and at which
 * block height.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { ForkConfigService, ForkConfigFromRpc, HttpTransport } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *
 *   console.log('Forking chain:', forkConfig.chainId)
 *   console.log('At block:', forkConfig.blockTag)
 * })
 *
 * // Run with RPC-fetched config
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
 * // Using static config for testing
 * import { ForkConfigStatic } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *   // Will use the statically configured values
 *   console.log('Chain ID:', forkConfig.chainId) // 10n
 *   console.log('Block tag:', forkConfig.blockTag) // 123456789n
 * })
 *
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(ForkConfigStatic({
 *       chainId: 10n,
 *       blockTag: 123456789n
 *     }))
 *   )
 * )
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/transport-effect/interfaces/forkconfigshape/ ForkConfigShape documentation}
 */

export {}
