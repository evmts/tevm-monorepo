import { Effect, Layer } from 'effect'
import { createCommon, tevmDefault } from '@tevm/common'
import { ForkConfigService } from '@tevm/transport-effect'
import { CommonService } from './CommonService.js'

/**
 * @module @tevm/common-effect/CommonFromFork
 * @description Layer that creates CommonService from ForkConfigService
 */

/**
 * @typedef {import('./types.js').CommonShape} CommonShape
 * @typedef {import('./types.js').Hardfork} Hardfork
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

/**
 * Configuration options for CommonFromFork layer
 * @typedef {Object} CommonFromForkOptions
 * @property {Hardfork} [hardfork] - Hardfork to use (default: 'prague')
 * @property {readonly number[]} [eips] - Additional EIPs to enable
 * @property {LogLevel} [loggingLevel] - Logging level (default: 'warn')
 */

/**
 * Creates a CommonService layer that auto-detects chain configuration from ForkConfigService.
 *
 * This layer is used when forking from a remote RPC endpoint. It reads the chain ID
 * from the ForkConfigService (which typically fetches it via `eth_chainId`) and
 * creates a Common object configured for that chain.
 *
 * The layer requires ForkConfigService to be provided, which in turn typically
 * requires TransportService (via ForkConfigFromRpc).
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { HttpTransport, ForkConfigFromRpc } from '@tevm/transport-effect'
 * import { CommonService, CommonFromFork } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const common = yield* CommonService
 *   console.log('Forking chain:', common.chainId)
 *   console.log('Hardfork:', common.hardfork)
 * })
 *
 * // Build the layer stack
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 *
 * // Merge all layers and run
 * const fullLayer = Layer.mergeAll(transportLayer, forkConfigLayer, commonLayer)
 * Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 * ```
 *
 * @example
 * ```javascript
 * // With custom hardfork and EIPs
 * const commonLayer = Layer.provide(
 *   CommonFromFork({ hardfork: 'cancun', eips: [7702] }),
 *   forkConfigLayer
 * )
 * ```
 *
 * @param {CommonFromForkOptions} [options] - Configuration options
 * @returns {Layer.Layer<CommonService, never, ForkConfigService>} Layer providing CommonService
 */
export const CommonFromFork = (options = {}) => {
	const hardfork = options.hardfork ?? 'prague'
	const eips = options.eips ?? []
	const loggingLevel = options.loggingLevel ?? 'warn'

	return Layer.effect(
		CommonService,
		Effect.gen(function* () {
			const forkConfig = yield* ForkConfigService

			const common = createCommon({
				...tevmDefault,
				id: Number(forkConfig.chainId),
				hardfork,
				eips: /** @type {number[]} */ ([...eips]),
				...(loggingLevel !== 'silent' && { loggingLevel }),
			}).copy() // Always copy to avoid mutation issues

			return /** @type {CommonShape} */ ({
				common,
				chainId: Number(forkConfig.chainId),
				hardfork,
				eips: common.ethjsCommon.eips(),
				copy: () => common.copy(),
			})
		}),
	)
}
