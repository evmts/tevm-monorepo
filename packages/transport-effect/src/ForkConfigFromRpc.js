import { ForkError } from '@tevm/errors-effect'
import { Effect, Layer } from 'effect'
import { ForkConfigService } from './ForkConfigService.js'
import { TransportService } from './TransportService.js'

/**
 * @module @tevm/transport-effect/ForkConfigFromRpc
 * @description Layer that fetches fork configuration from an RPC endpoint
 */

/**
 * @typedef {import('./types.js').ForkConfigShape} ForkConfigShape
 */

/**
 * A layer that fetches the fork configuration (chain ID and block number)
 * from an RPC endpoint.
 *
 * This layer requires a TransportService to be provided, which it uses to
 * make `eth_chainId` and `eth_blockNumber` RPC calls. The responses are
 * parsed and converted to bigint values.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import {
 *   ForkConfigService,
 *   ForkConfigFromRpc,
 *   HttpTransport
 * } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *
 *   console.log('Chain ID:', forkConfig.chainId)
 *   console.log('Block tag:', forkConfig.blockTag)
 *
 *   return forkConfig
 * })
 *
 * // Compose the layers
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 *
 * Effect.runPromise(program.pipe(Effect.provide(forkConfigLayer)))
 *   .then(config => console.log('Fork config:', config))
 * ```
 *
 * @example
 * ```javascript
 * // Error handling for RPC failures
 * const program = Effect.gen(function* () {
 *   const forkConfig = yield* ForkConfigService
 *   return forkConfig
 * }).pipe(
 *   Effect.catchTag('ForkError', (error) => {
 *     console.error('Failed to fetch fork config:', error.message)
 *     return Effect.succeed({ chainId: 1n, blockTag: 0n })
 *   })
 * )
 * ```
 *
 */
export const ForkConfigFromRpc = Layer.effect(
	ForkConfigService,
	Effect.gen(function* () {
		const transport = yield* TransportService

		// Fetch chain ID and block number in parallel
		const [chainIdHex, blockNumberHex] = yield* Effect.all([
			transport.request('eth_chainId'),
			transport.request('eth_blockNumber'),
		])

		// Parse BigInt values with proper error handling
		const chainId = yield* Effect.try({
			try: () => BigInt(/** @type {string} */ (chainIdHex)),
			catch: (error) =>
				new ForkError({
					method: 'eth_chainId',
					message: `Failed to parse chain ID: ${chainIdHex}`,
					cause: /** @type {Error} */ (error),
				}),
		})

		const blockTag = yield* Effect.try({
			try: () => BigInt(/** @type {string} */ (blockNumberHex)),
			catch: (error) =>
				new ForkError({
					method: 'eth_blockNumber',
					message: `Failed to parse block number: ${blockNumberHex}`,
					cause: /** @type {Error} */ (error),
				}),
		})

		return /** @type {ForkConfigShape} */ ({
			chainId,
			blockTag,
		})
	}),
)
