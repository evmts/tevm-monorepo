import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { GetStorageAtService } from './GetStorageAtService.js'
import { GetStorageAtLive } from './GetStorageAtLive.js'
import { StateManagerService } from '@tevm/state-effect'

// Create a mock StateManager for testing
const createMockStateManager = (overrides: Partial<Record<string, unknown>> = {}) => ({
	stateManager: {},
	getAccount: () => Effect.succeed(undefined),
	putAccount: () => Effect.succeed(undefined),
	deleteAccount: () => Effect.succeed(undefined),
	getStorage: () => Effect.succeed(new Uint8Array()),
	putStorage: () => Effect.succeed(undefined),
	clearStorage: () => Effect.succeed(undefined),
	getCode: () => Effect.succeed(new Uint8Array()),
	putCode: () => Effect.succeed(undefined),
	getStateRoot: () => Effect.succeed(new Uint8Array()),
	setStateRoot: () => Effect.succeed(undefined),
	checkpoint: () => Effect.succeed(undefined),
	commit: () => Effect.succeed(undefined),
	revert: () => Effect.succeed(undefined),
	dumpState: () => Effect.succeed({}),
	loadState: () => Effect.succeed(undefined),
	ready: Effect.succeed(undefined),
	deepCopy: () => Effect.succeed({} as any),
	shallowCopy: () => ({} as any),
	...overrides,
})

describe('GetStorageAtLive', () => {
	describe('layer composition', () => {
		it('should create a valid Layer', () => {
			expect(GetStorageAtLive).toBeDefined()
		})

		it('should provide GetStorageAtService when given StateManagerService', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const service = yield* GetStorageAtService
				expect(service).toBeDefined()
				expect(typeof service.getStorageAt).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(true)
		})
	})

	describe('getStorageAt', () => {
		it('should return 32 bytes of zeros for empty storage', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234567890123456789012345678901234567890',
					position: '0x0',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		})

		it('should return storage value', async () => {
			// Create a value representing number 100 in 32 bytes
			const storageValue = new Uint8Array(32)
			storageValue[31] = 100 // 100 in the last byte

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getStorage: () => Effect.succeed(storageValue),
				}) as any,
			)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0xABCDEF1234567890123456789012345678901234',
					position: '0x0000000000000000000000000000000000000000000000000000000000000001',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000064') // 64 = 100 in hex
		})

		it('should handle short position values by padding', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234567890123456789012345678901234567890',
					position: '0x1', // Short position
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		})
	})

	describe('validation', () => {
		it('should fail with InvalidParamsError for invalid address format', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: 'invalid-address' as any,
					position: '0x0',
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for missing address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: undefined as any,
					position: '0x0',
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for address with wrong length', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234', // Too short
					position: '0x0',
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for missing position', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234567890123456789012345678901234567890',
					position: undefined as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for position without 0x prefix', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234567890123456789012345678901234567890',
					position: '0000' as any, // position without 0x prefix
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for position with invalid hex chars', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: '0x1234567890123456789012345678901234567890',
					position: '0xGGGG' as any, // Invalid hex
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})
	})

	describe('error handling', () => {
		it('should allow catching InvalidParamsError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetStorageAtLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getStorageAt } = yield* GetStorageAtService
				return yield* getStorageAt({
					address: 'invalid' as any,
					position: '0x0',
				})
			}).pipe(
				Effect.catchTag('InvalidParamsError', (error) =>
					Effect.succeed({
						caught: true,
						errorMessage: error.message,
					}),
				),
			)

			const result = (await Effect.runPromise(program.pipe(Effect.provide(testLayer)))) as any
			expect(result.caught).toBe(true)
			expect(result.errorMessage).toContain('Invalid address format')
		})
	})
})
