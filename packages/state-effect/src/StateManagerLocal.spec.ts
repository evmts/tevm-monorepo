import { describe, it, expect } from 'vitest'
import { Effect, Layer, Exit } from 'effect'
import { StateManagerService } from './StateManagerService.js'
import { StateManagerLocal } from './StateManagerLocal.js'
import { CommonLocal } from '@tevm/common-effect'
import { createAddressFromString, EthjsAccount } from '@tevm/utils'

describe('StateManagerLocal', () => {
	describe('layer creation', () => {
		it('should create a layer that provides StateManagerService', () => {
			const layer = StateManagerLocal()
			expect(layer).toBeDefined()
		})

		it('should require CommonService dependency', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				return stateManager
			})

			// Should fail without CommonService
			const layer = StateManagerLocal()
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(layer as unknown as Layer.Layer<StateManagerService>)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe('with CommonLocal', () => {
		const fullLayer = Layer.provide(StateManagerLocal(), CommonLocal)

		it('should create a working state manager', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				expect(stateManager).toBeDefined()
				expect(stateManager.stateManager).toBeDefined()
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('success')
		})

		it('should wait for ready to complete', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				return 'ready'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('ready')
		})

		it('should get the state root', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const stateRoot = yield* stateManager.getStateRoot()
				return stateRoot
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(result).toBeInstanceOf(Uint8Array)
		})

		it('should support checkpoint and commit', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready

				yield* stateManager.checkpoint()
				yield* stateManager.commit()
				return 'committed'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('committed')
		})

		it('should support checkpoint and revert', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready

				yield* stateManager.checkpoint()
				yield* stateManager.revert()
				return 'reverted'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('reverted')
		})

		it('should get undefined for non-existent account', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				const account = yield* stateManager.getAccount(address as any)
				return account
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeUndefined()
		})

		it('should support putAccount and getAccount', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				const account = new EthjsAccount()
				yield* stateManager.putAccount(address as any, account)
				const retrieved = yield* stateManager.getAccount(address as any)
				return retrieved
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
		})

		it('should support deleteAccount', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				yield* stateManager.deleteAccount(address as any)
				return 'deleted'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('deleted')
		})

		it('should support putStorage and getStorage', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				const slot = new Uint8Array(32)
				const value = new Uint8Array([1, 2, 3, 4])
				// Need to create account first before putting storage
				const account = new EthjsAccount()
				yield* stateManager.putAccount(address as any, account)
				yield* stateManager.checkpoint()
				yield* stateManager.putStorage(address as any, slot, value)
				yield* stateManager.commit()
				const retrieved = yield* stateManager.getStorage(address as any, slot)
				return retrieved
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
		})

		it('should support clearStorage', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				yield* stateManager.clearStorage(address as any)
				return 'cleared'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('cleared')
		})

		it('should support getCode', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				const code = yield* stateManager.getCode(address as any)
				return code
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeInstanceOf(Uint8Array)
		})

		it('should support putCode', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const address = createAddressFromString('0x1234567890123456789012345678901234567890')
				const code = new Uint8Array([0x60, 0x00, 0x60, 0x00])
				yield* stateManager.putCode(address as any, code)
				return 'code put'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('code put')
		})

		it('should support deepCopy', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const copy = yield* stateManager.deepCopy()
				expect(copy).toBeDefined()
				expect(copy.stateManager).toBeDefined()
				// Should be a separate instance
				expect(copy.stateManager).not.toBe(stateManager.stateManager)
				return 'copied'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('copied')
		})

		it('should support shallowCopy', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const copy = stateManager.shallowCopy()
				expect(copy).toBeDefined()
				expect(copy.stateManager).toBeDefined()
				return 'shallow copied'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('shallow copied')
		})

		it('should support dumpState', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const state = yield* stateManager.dumpState()
				return state
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBeDefined()
			expect(typeof result).toBe('object')
		})

		it('should support loadState', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				// Load empty state
				yield* stateManager.loadState({})
				return 'loaded'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('loaded')
		})

		it('should have clearStorage method', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				expect(typeof stateManager.clearStorage).toBe('function')
				return 'clearStorage exists'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('clearStorage exists')
		})

		it('should have deleteAccount method', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				expect(typeof stateManager.deleteAccount).toBe('function')
				return 'deleteAccount exists'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('deleteAccount exists')
		})

		it('should have putCode method', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				expect(typeof stateManager.putCode).toBe('function')
				return 'putCode exists'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('putCode exists')
		})

		it('should have putAccount method', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				expect(typeof stateManager.putAccount).toBe('function')
				return 'putAccount exists'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('putAccount exists')
		})

		it('should have setStateRoot method', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				expect(typeof stateManager.setStateRoot).toBe('function')
				return 'setStateRoot exists'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('setStateRoot exists')
		})

		it('should fail with StateRootNotFoundError when setting non-existent state root', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				// Try to set a non-existent state root
				const fakeRoot = new Uint8Array(32).fill(0xab)
				yield* stateManager.setStateRoot(fakeRoot)
				return 'should not reach'
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(fullLayer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should support deep copy methods on copied state manager', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				const copy = yield* stateManager.deepCopy()
				// Verify the copied state manager has all the methods
				const stateRoot = yield* copy.getStateRoot()
				expect(stateRoot).toBeDefined()
				return 'deep copy works'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('deep copy works')
		})
	})

	describe('with custom options', () => {
		it('should accept StateManagerLocalOptions with loggingEnabled', async () => {
			const layer = StateManagerLocal({
				loggingEnabled: true,
			})
			const fullLayer = Layer.provide(layer, CommonLocal)

			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				yield* stateManager.ready
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe('success')
		})

		it('should accept empty options', () => {
			const layer = StateManagerLocal({})
			expect(layer).toBeDefined()
		})
	})
})
