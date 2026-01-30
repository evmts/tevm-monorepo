import { Effect, Layer } from 'effect'
import { createEvm } from '@tevm/evm'
import { CommonService } from '@tevm/common-effect'
import { StateManagerService } from '@tevm/state-effect'
import { BlockchainService } from '@tevm/blockchain-effect'
import { EvmService } from './EvmService.js'
import { mapEvmError } from './mapEvmError.js'

/**
 * @module @tevm/evm-effect/EvmLive
 * @description Layer that creates EvmService
 */

/**
 * @typedef {import('./types.js').EvmShape} EvmShape
 * @typedef {import('./types.js').EvmLiveOptions} EvmLiveOptions
 */

/**
 * Creates an EvmService layer.
 *
 * This layer creates an EVM instance using the provided CommonService,
 * StateManagerService, and BlockchainService dependencies.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { EvmService, EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const evmService = yield* EvmService
 *
 *   const result = yield* evmService.runCall({
 *     to: address,
 *     data: calldata,
 *     gasLimit: 1000000n
 *   })
 *   console.log('Result:', result)
 * })
 *
 * // Build the layer stack
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
 * const evmLayer = Layer.provide(
 *   EvmLive(),
 *   Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(evmLayer)))
 * ```
 *
 * @example
 * ```javascript
 * // With custom precompiles
 * const layer = EvmLive({
 *   customPrecompiles: [myPrecompile],
 *   allowUnlimitedContractSize: true,
 *   profiler: true,
 *   loggingEnabled: true
 * })
 * ```
 *
 * @param {EvmLiveOptions} [options] - Configuration options
 * @returns {Layer.Layer<import('./EvmService.js').EvmServiceId, never, CommonService | StateManagerService | BlockchainService>} Layer providing EvmService
 */
export const EvmLive = (options = {}) => {
	return Layer.effect(
		EvmService,
		Effect.gen(function* () {
			const commonShape = yield* CommonService
			const stateManagerShape = yield* StateManagerService
			const blockchainShape = yield* BlockchainService

			const evm = yield* Effect.promise(() =>
				createEvm({
					common: commonShape.common,
					stateManager: stateManagerShape.stateManager,
					blockchain: blockchainShape.chain,
					allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
					customPrecompiles: options.customPrecompiles ?? [],
					profiler: options.profiler ?? false,
					loggingLevel: options.loggingEnabled ? 'debug' : 'fatal',
				}),
			)

			/** @type {EvmShape} */
			const shape = {
				evm,

				runCall: (opts) =>
					Effect.tryPromise({
						try: () => evm.runCall(opts),
						catch: (e) => mapEvmError(e),
					}),

				runCode: (opts) =>
					Effect.tryPromise({
						try: () => evm.runCode(opts),
						catch: (e) => mapEvmError(e),
					}),

				getActivePrecompiles: () => Effect.sync(() => evm.precompiles),

				addCustomPrecompile: (precompile) =>
					Effect.sync(() => evm.addCustomPrecompile(precompile)),

				removeCustomPrecompile: (precompile) =>
					Effect.sync(() => evm.removeCustomPrecompile(precompile)),
			}

			return shape
		}),
	)
}
