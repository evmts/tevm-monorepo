import { Effect, Layer } from 'effect'
import { createVm } from '@tevm/vm'
import { CommonService } from '@tevm/common-effect'
import { StateManagerService } from '@tevm/state-effect'
import { BlockchainService } from '@tevm/blockchain-effect'
import { EvmService } from '@tevm/evm-effect'
import { VmService } from './VmService.js'

/**
 * @module @tevm/vm-effect/VmLive
 * @description Layer that creates VmService
 */

/**
 * @typedef {import('./types.js').VmShape} VmShape
 * @typedef {import('./types.js').VmLiveOptions} VmLiveOptions
 */

/**
 * Creates a VmService layer.
 *
 * This layer creates a VM instance using the provided CommonService,
 * StateManagerService, BlockchainService, and EvmService dependencies.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { VmService, VmLive } from '@tevm/vm-effect'
 * import { EvmLive } from '@tevm/evm-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { BlockchainLocal } from '@tevm/blockchain-effect'
 * import { CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const vmService = yield* VmService
 *   yield* vmService.ready
 *
 *   console.log('VM ready')
 * })
 *
 * // Build the layer stack
 * const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
 * const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
 * const evmLayer = Layer.provide(EvmLive(), Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal))
 * const vmLayer = Layer.provide(
 *   VmLive(),
 *   Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(vmLayer)))
 * ```
 *
 * @param {VmLiveOptions} [options] - Configuration options
 * @returns {Layer.Layer<VmService, never, CommonService | StateManagerService | BlockchainService | EvmService>} Layer providing VmService
 */
export const VmLive = (options = {}) => {
	return Layer.effect(
		VmService,
		Effect.gen(function* () {
			const commonShape = yield* CommonService
			const stateManagerShape = yield* StateManagerService
			const blockchainShape = yield* BlockchainService
			const evmShape = yield* EvmService

			const vm = createVm({
				common: commonShape.common,
				stateManager: stateManagerShape.stateManager,
				blockchain: blockchainShape.chain,
				evm: evmShape.evm,
				profiler: options.profiler ?? false,
			})

			/**
			 * Helper to create VmShape from a vm instance
			 * @param {import('@tevm/vm').Vm} vmInstance
			 * @returns {VmShape}
			 */
			const createShape = (vmInstance) => {
				/** @type {VmShape} */
				const shape = {
					vm: vmInstance,

					runTx: (opts) => Effect.promise(() => vmInstance.runTx(opts)),

					runBlock: (opts) => Effect.promise(() => vmInstance.runBlock(opts)),

					buildBlock: (opts) => Effect.promise(async () => vmInstance.buildBlock(opts)),

					ready: Effect.promise(() => vmInstance.ready()),

					deepCopy: () =>
						Effect.gen(function* () {
							const copiedVm = yield* Effect.promise(() => vmInstance.deepCopy())
							return createShape(copiedVm)
						}),
				}
				return shape
			}

			return createShape(vm)
		}),
	)
}
