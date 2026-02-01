import { Effect, Layer } from 'effect'
import { createVm } from '@tevm/vm'
import { CommonService } from '@tevm/common-effect'
import { StateManagerService } from '@tevm/state-effect'
import { BlockchainService } from '@tevm/blockchain-effect'
import { EvmService, mapEvmError } from '@tevm/evm-effect'
import { TevmError } from '@tevm/errors-effect'
import { VmService } from './VmService.js'

/**
 * @module @tevm/vm-effect/VmLive
 * @description Layer that creates VmService
 */

/**
 * @typedef {import('./types.js').VmShape} VmShape
 * @typedef {import('./types.js').VmLiveOptions} VmLiveOptions
 * @typedef {import('./VmService.js').VmServiceId} VmServiceId
 */

/**
 * Creates a VmService layer.
 *
 * This layer creates a VM instance using the provided CommonService,
 * StateManagerService, BlockchainService, and EvmService dependencies.
 *
 * Note: For profiling and logging configuration, use EvmLive options:
 * ```javascript
 * const evmLayer = EvmLive({ profiler: true, loggingEnabled: true })
 * const vmLayer = VmLive() // VM uses the configured EVM
 * ```
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
 * @param {VmLiveOptions} [_options] - Configuration options (currently unused, reserved for API compatibility)
 * @returns {Layer.Layer<VmServiceId, TevmError, typeof CommonService | typeof StateManagerService | typeof BlockchainService | typeof EvmService>} Layer providing VmService
 * @throws {TevmError} If the VM instance fails to initialize (captured in the typed error channel)
 */
export const VmLive = (_options = {}) => {
	// VmLiveOptions is empty - profiler/logging should be configured at EvmLive layer
	return Layer.effect(
		VmService,
		Effect.gen(function* () {
			const commonShape = yield* CommonService
			const stateManagerShape = yield* StateManagerService
			const blockchainShape = yield* BlockchainService
			const evmShape = yield* EvmService

			// Wrap createVm in Effect.try to capture synchronous exceptions
			// in the typed error channel (Issue #161)
			const vm = yield* Effect.try({
				try: () =>
					createVm({
						common: commonShape.common,
						stateManager: stateManagerShape.stateManager,
						blockchain: blockchainShape.chain,
						evm: /** @type {import('@tevm/vm').CreateVmOptions['evm']} */ (evmShape.evm),
					}),
				catch: (error) =>
					new TevmError({
						message: `Failed to create VM: ${error instanceof Error ? error.message : String(error)}`,
						code: -32603,
						cause: error,
						docsPath: '/reference/tevm/vm-effect/',
					}),
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

					runTx: (opts) =>
						Effect.tryPromise({
							try: () => vmInstance.runTx(opts),
							catch: (e) => mapEvmError(e),
						}),

					runBlock: (opts) =>
						Effect.tryPromise({
							try: () => vmInstance.runBlock(opts),
							catch: (e) => mapEvmError(e),
						}),

					buildBlock: (opts) =>
						Effect.tryPromise({
							try: async () => vmInstance.buildBlock(opts),
							catch: (e) => mapEvmError(e),
						}),

					ready: Effect.tryPromise({
						try: () => vmInstance.ready(),
						catch: (e) => mapEvmError(e),
					}),

					deepCopy: () =>
						Effect.gen(function* () {
							const copiedVm = yield* Effect.tryPromise({
							try: () => vmInstance.deepCopy(),
							catch: (e) => mapEvmError(e),
						})
							return createShape(copiedVm)
						}),
				}
				return shape
			}

			return createShape(vm)
		}),
	)
}
