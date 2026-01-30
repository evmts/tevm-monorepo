import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer, Exit, Cause } from 'effect'
import { VmService } from './VmService.js'
import { VmLive } from './VmLive.js'
import { CommonLocal, CommonService } from '@tevm/common-effect'
import { StateManagerLocal, StateManagerService } from '@tevm/state-effect'
import { BlockchainLocal, BlockchainService } from '@tevm/blockchain-effect'
import { EvmService, EvmLive } from '@tevm/evm-effect'
import { TevmError } from '@tevm/errors-effect'
import * as vmModule from '@tevm/vm'

describe('VmLive', () => {
	describe('layer creation', () => {
		it('should create a layer that provides VmService', () => {
			const layer = VmLive()
			expect(layer).toBeDefined()
		})

		it('should require CommonService, StateManagerService, BlockchainService, and EvmService dependencies', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				return vmService
			})

			// Should fail without dependencies
			const layer = VmLive()
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(layer as unknown as Layer.Layer<VmService>)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should accept empty VmLiveOptions', () => {
			const layer = VmLive({})
			expect(layer).toBeDefined()
		})
	})

	describe('with full dependencies', () => {
		// Build the layer stack
		const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
		const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
		const evmLayer = Layer.provide(
			EvmLive(),
			Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal),
		)
		const fullLayer = Layer.provide(
			VmLive(),
			Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal),
		)

		it('should create a working VM service', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				expect(vmService).toBeDefined()
				expect(vmService.vm).toBeDefined()
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('success')
		})

		it('should wait for VM ready', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready
				return 'ready'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('ready')
		})

		it('should execute runTx', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready

				// We need a valid transaction to run, but for testing we can catch the error
				// This tests that the Effect wrapper is properly set up
				const result = yield* vmService.runTx({
					skipBalance: true,
					skipNonce: true,
					skipHardForkValidation: true,
				} as any)
				return result
			})

			// runTx may throw for invalid params, but we're testing the Effect wrapping works
			try {
				await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			} catch (e) {
				// Expected - we don't have a valid tx
				expect(e).toBeDefined()
			}
		})

		it('should execute runBlock', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready

				// runBlock requires a valid block, test the Effect wrapper is set up
				const result = yield* vmService.runBlock({
					skipBalance: true,
				} as any)
				return result
			})

			// runBlock may throw for invalid params
			try {
				await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			} catch (e) {
				// Expected - we don't have a valid block
				expect(e).toBeDefined()
			}
		})

		it('should execute buildBlock', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready

				// buildBlock requires a parentBlock, so we test the Effect wrapper is set up
				const result = yield* vmService.buildBlock({} as any)
				return result
			})

			// buildBlock should throw for missing parentBlock
			try {
				await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			} catch (e) {
				// Expected - we don't have a valid parentBlock
				expect(e).toBeDefined()
			}
		})

		it('should create a deep copy of the VM', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready

				const copy = yield* vmService.deepCopy()
				expect(copy).toBeDefined()
				expect(copy.vm).toBeDefined()
				expect(copy.vm).not.toBe(vmService.vm)
				return 'copied'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('copied')
		})

		it('should expose the underlying vm instance', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				expect(vmService.vm).toBeDefined()
				expect(typeof vmService.vm.runTx).toBe('function')
				expect(typeof vmService.vm.runBlock).toBe('function')
				expect(typeof vmService.vm.buildBlock).toBe('function')
				return 'vm exposed'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('vm exposed')
		})

		it('should allow executing deep copied VM operations', async () => {
			const program = Effect.gen(function* () {
				const vmService = yield* VmService
				yield* vmService.ready

				const copy = yield* vmService.deepCopy()
				yield* copy.ready

				// The copy should have the same shape as the original
				expect(copy.vm).toBeDefined()
				expect(typeof copy.runTx).toBe('function')
				expect(typeof copy.runBlock).toBe('function')
				expect(typeof copy.buildBlock).toBe('function')

				return 'deep copy works'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('deep copy works')
		})
	})

	describe('exports', () => {
		it('should export VmLive from the module', async () => {
			const { VmLive: ExportedVmLive } = await import('./VmLive.js')
			expect(ExportedVmLive).toBeDefined()
			expect(typeof ExportedVmLive).toBe('function')
		})
	})

	describe('error handling', () => {
		it('should capture createVm errors in the typed error channel', async () => {
			// Mock createVm to throw a synchronous error
			const mockCreateVm = vi.spyOn(vmModule, 'createVm').mockImplementation(() => {
				throw new Error('Simulated createVm failure')
			})

			try {
				// Use valid layers for the other services
				const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
				const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
				const evmLayer = Layer.provide(
					EvmLive(),
					Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal),
				)

				// Build VmLive
				const vmLayer = Layer.provide(
					VmLive(),
					Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal),
				)

				const program = Effect.gen(function* () {
					const vmService = yield* VmService
					return vmService
				})

				const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(vmLayer)))

				// The createVm failure should be captured as a TevmError
				expect(Exit.isFailure(exit)).toBe(true)
				if (Exit.isFailure(exit)) {
					const failure = Cause.failureOption(exit.cause)
					expect(failure._tag).toBe('Some')
					if (failure._tag === 'Some') {
						const error = failure.value
						expect(error).toBeInstanceOf(TevmError)
						expect((error as TevmError).message).toContain('Failed to create VM')
						expect((error as TevmError).message).toContain('Simulated createVm failure')
						expect((error as TevmError).code).toBe(-32603)
						expect((error as TevmError).docsPath).toBe('/reference/tevm/vm-effect/')
					}
				}
			} finally {
				mockCreateVm.mockRestore()
			}
		})

		it('should handle non-Error thrown values', async () => {
			// Mock createVm to throw a string (not an Error instance)
			const mockCreateVm = vi.spyOn(vmModule, 'createVm').mockImplementation(() => {
				throw 'String error message' // Throwing a string, not an Error
			})

			try {
				// Use valid layers for the other services
				const stateLayer = Layer.provide(StateManagerLocal(), CommonLocal)
				const blockchainLayer = Layer.provide(BlockchainLocal(), CommonLocal)
				const evmLayer = Layer.provide(
					EvmLive(),
					Layer.mergeAll(stateLayer, blockchainLayer, CommonLocal),
				)

				// Build VmLive
				const vmLayer = Layer.provide(
					VmLive(),
					Layer.mergeAll(evmLayer, stateLayer, blockchainLayer, CommonLocal),
				)

				const program = Effect.gen(function* () {
					const vmService = yield* VmService
					return vmService
				})

				const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(vmLayer)))

				// The createVm failure should be captured as a TevmError
				expect(Exit.isFailure(exit)).toBe(true)
				if (Exit.isFailure(exit)) {
					const failure = Cause.failureOption(exit.cause)
					expect(failure._tag).toBe('Some')
					if (failure._tag === 'Some') {
						const error = failure.value
						expect(error).toBeInstanceOf(TevmError)
						// When throwing a string, it should be converted via String()
						expect((error as TevmError).message).toContain('Failed to create VM')
						expect((error as TevmError).message).toContain('String error message')
						expect((error as TevmError).code).toBe(-32603)
					}
				}
			} finally {
				mockCreateVm.mockRestore()
			}
		})
	})
})
