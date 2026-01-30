import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { GetCodeService } from './GetCodeService.js'
import { GetCodeLive } from './GetCodeLive.js'
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

describe('GetCodeLive', () => {
	describe('layer composition', () => {
		it('should create a valid Layer', () => {
			expect(GetCodeLive).toBeDefined()
		})

		it('should provide GetCodeService when given StateManagerService', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const service = yield* GetCodeService
				expect(service).toBeDefined()
				expect(typeof service.getCode).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(true)
		})
	})

	describe('getCode', () => {
		it('should return 0x for non-existent account', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x')
		})

		it('should return contract bytecode', async () => {
			const contractCode = new Uint8Array([0x60, 0x80, 0x60, 0x40, 0x52]) // Sample bytecode

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getCode: () => Effect.succeed(contractCode),
				}) as any,
			)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: '0xABCDEF1234567890123456789012345678901234',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x6080604052')
		})

		it('should handle empty bytecode', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getCode: () => Effect.succeed(new Uint8Array(0)),
				}) as any,
			)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe('0x')
		})
	})

	describe('validation', () => {
		it('should fail with InvalidParamsError for invalid address format', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: 'invalid-address' as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for missing address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: undefined as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for address with wrong length', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: '0x1234', // Too short
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})
	})

	describe('error handling', () => {
		it('should allow catching InvalidParamsError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetCodeLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getCode } = yield* GetCodeService
				return yield* getCode({
					address: 'invalid' as any,
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
