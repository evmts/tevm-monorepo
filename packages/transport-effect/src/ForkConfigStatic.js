import { Layer } from 'effect'
import { ForkConfigService } from './ForkConfigService.js'

/**
 * @module @tevm/transport-effect/ForkConfigStatic
 * @description Static fork configuration layer for testing or known values
 */

/**
 * @typedef {import('./types.js').ForkConfigShape} ForkConfigShape
 */

/**
 * Creates a static fork configuration layer with explicit values.
 *
 * This is useful for testing or when you know the exact chain ID and block
 * number you want to fork from. Unlike ForkConfigFromRpc, this layer does
 * not require a TransportService and does not make any network requests.
 *
 * @param {ForkConfigShape} config - The fork configuration to use
 * @returns {Layer.Layer<ForkConfigService, never, never>} A Layer providing ForkConfigService
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { ForkConfigService, ForkConfigStatic } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *
 *   console.log('Chain ID:', forkConfig.chainId) // 1n
 *   console.log('Block tag:', forkConfig.blockTag) // 18000000n
 *
 *   return forkConfig
 * })
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
 *
 * @example
 * ```javascript
 * // Using in tests
 * import { describe, it, expect } from 'vitest'
 * import { Effect } from 'effect'
 *
 * describe('MyService', () => {
 *   it('should work with forked chain', async () => {
 *     const testConfig = ForkConfigStatic({
 *       chainId: 10n,
 *       blockTag: 123456789n
 *     })
 *
 *     const result = await Effect.runPromise(
 *       myProgram.pipe(Effect.provide(testConfig))
 *     )
 *
 *     expect(result).toBeDefined()
 *   })
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using for local development with known block
 * const optimismMainnet = ForkConfigStatic({
 *   chainId: 10n,
 *   blockTag: 115000000n
 * })
 *
 * const ethereumMainnet = ForkConfigStatic({
 *   chainId: 1n,
 *   blockTag: 19000000n
 * })
 * ```
 */
export const ForkConfigStatic = (config) => {
	return Layer.succeed(ForkConfigService, config)
}
