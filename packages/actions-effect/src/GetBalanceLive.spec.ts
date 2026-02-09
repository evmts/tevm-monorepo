import { StateManagerService } from '@tevm/state-effect'
import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { GetBalanceLive } from './GetBalanceLive.js'
import { GetBalanceService } from './GetBalanceService.js'

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
	shallowCopy: () => ({}) as any,
	...overrides,
})

describe('GetBalanceLive', () => {
	describe('layer composition', () => {
		it('should create a valid Layer', () => {
			expect(GetBalanceLive).toBeDefined()
		})

		it('should provide GetBalanceService when given StateManagerService', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const service = yield* GetBalanceService
				expect(service).toBeDefined()
				expect(typeof service.getBalance).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(true)
		})
	})

	describe('getBalance', () => {
		it('should return 0 for non-existent account', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(0n)
		})

		it('should return account balance', async () => {
			const mockAccount = {
				nonce: 5n,
				balance: 1000000000000000000n, // 1 ETH
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0xABCDEF1234567890123456789012345678901234',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(1000000000000000000n)
		})

		it('should return 0n when account has undefined balance', async () => {
			const mockAccount = {
				nonce: 1n,
				balance: undefined,
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(0n)
		})
	})

	describe('validation', () => {
		it('should fail with InvalidParamsError for invalid address format', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: 'invalid-address' as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for missing address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: undefined as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for address with wrong length', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0x1234', // Too short
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for unsupported blockTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0x1234567890123456789012345678901234567890',
					blockTag: 'earliest', // Unsupported blockTag
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))
			expect(result._tag).toBe('Failure')
		})

		it('should succeed with blockTag latest', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
					address: '0x1234567890123456789012345678901234567890',
					blockTag: 'latest',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(0n)
		})
	})

	describe('error handling', () => {
		it('should allow catching InvalidParamsError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetBalanceLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getBalance } = yield* GetBalanceService
				return yield* getBalance({
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
