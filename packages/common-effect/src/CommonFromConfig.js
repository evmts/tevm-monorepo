import { Layer } from 'effect'
import { createCommon, tevmDefault } from '@tevm/common'
import { CommonService } from './CommonService.js'

/**
 * @module @tevm/common-effect/CommonFromConfig
 * @description Layer that creates CommonService from explicit configuration
 */

/**
 * @typedef {import('./types.js').CommonShape} CommonShape
 * @typedef {import('./types.js').CommonConfigOptions} CommonConfigOptions
 */

/**
 * Creates a CommonService layer from explicit configuration.
 *
 * This layer is used when you want to specify chain configuration explicitly,
 * rather than auto-detecting from a fork RPC endpoint. It's useful for:
 * - Local development with a custom chain ID
 * - Testing with specific hardfork settings
 * - Non-fork mode where no RPC is needed
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { CommonService, CommonFromConfig } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const common = yield* CommonService
 *   console.log('Chain ID:', common.chainId)
 *   console.log('Hardfork:', common.hardfork)
 *   console.log('EIPs:', common.eips)
 * })
 *
 * // Run with mainnet configuration
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(CommonFromConfig({
 *       chainId: 1,
 *       hardfork: 'prague'
 *     }))
 *   )
 * )
 * ```
 *
 * @example
 * ```javascript
 * // Default configuration (tevm-devnet, chain ID 900)
 * Effect.runPromise(
 *   program.pipe(Effect.provide(CommonFromConfig()))
 * )
 * ```
 *
 * @example
 * ```javascript
 * // With custom EIPs enabled
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(CommonFromConfig({
 *       chainId: 10, // Optimism
 *       hardfork: 'prague',
 *       eips: [7702] // Enable account abstraction
 *     }))
 *   )
 * )
 * ```
 *
 * @param {CommonConfigOptions} [config] - Configuration options
 * @returns {Layer.Layer<CommonService, never, never>} Layer providing CommonService with no dependencies
 */
export const CommonFromConfig = (config = {}) => {
	const chainId = config.chainId ?? 900 // tevm-devnet default
	const hardfork = config.hardfork ?? 'prague'
	const eips = config.eips ?? []
	const loggingLevel = config.loggingLevel ?? 'warn'

	const common = createCommon({
		...tevmDefault,
		id: chainId,
		hardfork,
		eips: /** @type {number[]} */ ([...eips]),
		...(loggingLevel !== 'silent' && { loggingLevel }),
		...(config.customCrypto && { customCrypto: config.customCrypto }),
	}).copy() // Always copy to avoid mutation issues

	return Layer.succeed(
		CommonService,
		/** @type {CommonShape} */ ({
			common,
			chainId,
			hardfork,
			eips: common.ethjsCommon.eips(),
			copy: () => common.copy(),
		}),
	)
}
