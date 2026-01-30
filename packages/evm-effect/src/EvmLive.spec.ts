import { describe, it, expect } from 'vitest'
import { Effect, Layer, Exit } from 'effect'
import { EvmService } from './EvmService.js'
import { EvmLive } from './EvmLive.js'
import { CommonLocal } from '@tevm/common-effect'
import { StateManagerService, StateManagerLocal } from '@tevm/state-effect'
import { BlockchainService, BlockchainLocal } from '@tevm/blockchain-effect'
import { createAddressFromString } from '@tevm/utils'

describe('EvmLive', () => {
	describe('layer creation', () => {
		it('should create a layer that provides EvmService', () => {
			const layer = EvmLive()
			expect(layer).toBeDefined()
		})

		it('should require CommonService, StateManagerService, and BlockchainService dependencies', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				return evmService
			})

			// Should fail without dependencies
			const layer = EvmLive()
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(layer as unknown as Layer.Layer<EvmService>)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should accept EvmLiveOptions with allowUnlimitedContractSize', () => {
			const layer = EvmLive({
				allowUnlimitedContractSize: true,
			})
			expect(layer).toBeDefined()
		})

		it('should accept EvmLiveOptions with profiler', () => {
			const layer = EvmLive({
				profiler: true,
			})
			expect(layer).toBeDefined()
		})

		it('should accept EvmLiveOptions with loggingEnabled', () => {
			const layer = EvmLive({
				loggingEnabled: true,
			})
			expect(layer).toBeDefined()
		})

		it('should accept empty EvmLiveOptions', () => {
			const layer = EvmLive({})
			expect(layer).toBeDefined()
		})
	})

	describe('with full dependencies', () => {
		// Build the layer stack
		const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
		const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
		const fullLayer = Layer.provide(
			EvmLive(),
			Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal),
		)

		it('should create a working EVM service', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				expect(evmService).toBeDefined()
				expect(evmService.evm).toBeDefined()
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('success')
		})

		it('should get active precompiles', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				const precompiles = yield* evmService.getActivePrecompiles()
				return precompiles
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(result instanceof Map).toBe(true)
		})

		it('should execute runCall', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				// Execute a simple call with no data (just creates empty call)
				const result = yield* evmService.runCall({
					gasLimit: 1000000n,
					skipBalance: true,
				})
				return result
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(result.execResult).toBeDefined()
		})

		it('should execute runCode', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				// Execute runCode with bytecode (PUSH1 0x42 PUSH1 0x00 MSTORE PUSH1 0x01 PUSH1 0x1F RETURN)
				// This bytecode stores 0x42 at memory and returns 1 byte
				const code = new Uint8Array([0x60, 0x42, 0x60, 0x00, 0x52, 0x60, 0x01, 0x60, 0x1f, 0xf3])
				const result = yield* evmService.runCode({
					code,
					gasLimit: 1000000n,
				})
				return result
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			// runCode returns ExecResult directly (not wrapped in EVMResult)
			expect(result.executionGasUsed).toBeDefined()
		})

		it('should add and remove custom precompile', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				// Create a mock precompile
				const mockPrecompile = {
					address: createAddressFromString('0x0000000000000000000000000000000000000020'),
					function: async () => ({ returnValue: new Uint8Array(), executionGasUsed: 0n }),
				}
				// Add the precompile
				yield* evmService.addCustomPrecompile(mockPrecompile as any)
				// Remove the precompile
				yield* evmService.removeCustomPrecompile(mockPrecompile as any)
				return 'precompile added and removed'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('precompile added and removed')
		})

		it('should expose the underlying evm instance', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				expect(evmService.evm).toBeDefined()
				expect(typeof evmService.evm.runCall).toBe('function')
				return 'evm exposed'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('evm exposed')
		})

		it('should execute call with value transfer', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				const to = createAddressFromString('0x1234567890123456789012345678901234567890')
				const result = yield* evmService.runCall({
					to: to as any,
					value: 100n,
					gasLimit: 1000000n,
					skipBalance: true,
				})
				return result
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(result.execResult).toBeDefined()
		})
	})

	describe('with loggingEnabled option', () => {
		// Build the layer stack with loggingEnabled
		const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
		const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
		const fullLayerWithLogging = Layer.provide(
			EvmLive({ loggingEnabled: true }),
			Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal),
		)

		it('should work with loggingEnabled true', async () => {
			const program = Effect.gen(function* () {
				const evmService = yield* EvmService
				expect(evmService).toBeDefined()
				const precompiles = yield* evmService.getActivePrecompiles()
				return precompiles
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayerWithLogging)))
			expect(result).toBeDefined()
		})
	})

	describe('exports', () => {
		it('should export EvmLive from the module', async () => {
			const { EvmLive: ExportedEvmLive } = await import('./EvmLive.js')
			expect(ExportedEvmLive).toBeDefined()
			expect(typeof ExportedEvmLive).toBe('function')
		})
	})
})
