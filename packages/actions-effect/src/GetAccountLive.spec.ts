import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { GetAccountService } from './GetAccountService.js'
import { GetAccountLive } from './GetAccountLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError } from '@tevm/errors-effect'

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

describe('GetAccountLive', () => {
	describe('layer composition', () => {
		it('should create a valid Layer', () => {
			expect(GetAccountLive).toBeDefined()
		})

		it('should provide GetAccountService when given StateManagerService', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const service = yield* GetAccountService
				expect(service).toBeDefined()
				expect(typeof service.getAccount).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(true)
		})
	})

	describe('getAccount', () => {
		it('should return empty account for non-existent address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				const result = yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
				return result
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(result.nonce).toBe(0n)
			expect(result.balance).toBe(0n)
			expect(result.deployedBytecode).toBe('0x')
			expect(result.isContract).toBe(false)
			expect(result.isEmpty).toBe(true)
		})

		it('should return account data for existing account with balance', async () => {
			const mockAccount = {
				nonce: 5n,
				balance: 1000000000000000000n, // 1 ETH
				storageRoot: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
				codeHash: new Uint8Array([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]),
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0xABCDEF1234567890123456789012345678901234',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0xabcdef1234567890123456789012345678901234') // lowercased
			expect(result.nonce).toBe(5n)
			expect(result.balance).toBe(1000000000000000000n)
			expect(result.isContract).toBe(false)
			expect(result.isEmpty).toBe(false)
		})

		it('should detect contract accounts', async () => {
			const contractCode = new Uint8Array([0x60, 0x60, 0x60, 0x40]) // Some bytecode

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () =>
						Effect.succeed({
							nonce: 1n,
							balance: 0n,
							storageRoot: new Uint8Array(32),
							codeHash: new Uint8Array(32),
						}),
					getCode: () => Effect.succeed(contractCode),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.isContract).toBe(true)
			expect(result.deployedBytecode).toBe('0x60606040')
			expect(result.isEmpty).toBe(false)
		})

		it('should fail with InvalidParamsError for invalid address format', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: 'invalid-address' as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
			if (result._tag === 'Failure') {
				const error = result.cause
				// Check it's an InvalidParamsError via the error channel
				expect(error._tag).toBe('Fail')
			}
		})

		it('should fail with InvalidParamsError for missing address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: undefined as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for address with wrong length', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234', // Too short
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should lowercase the address in the result', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0xabcdef1234567890abcdef1234567890abcdef12')
		})
	})

	describe('edge cases for branch coverage', () => {
		it('should use default EMPTY_STORAGE_ROOT when storageRoot is undefined', async () => {
			const mockAccount = {
				nonce: 1n,
				balance: 100n,
				storageRoot: undefined, // undefined storageRoot
				codeHash: new Uint8Array([1, 2, 3]),
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			// Should fall back to EMPTY_STORAGE_ROOT
			expect(result.storageRoot).toBe('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421')
		})

		it('should use default EMPTY_CODE_HASH when codeHash is undefined', async () => {
			const mockAccount = {
				nonce: 1n,
				balance: 100n,
				storageRoot: new Uint8Array([1, 2, 3]),
				codeHash: undefined, // undefined codeHash
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			// Should fall back to EMPTY_CODE_HASH
			expect(result.codeHash).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
		})

		it('should use default 0n when nonce is undefined', async () => {
			const mockAccount = {
				nonce: undefined, // undefined nonce
				balance: 100n,
				storageRoot: new Uint8Array([1, 2, 3]),
				codeHash: new Uint8Array([4, 5, 6]),
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.nonce).toBe(0n)
		})

		it('should return isEmpty=false for contract with zero balance and nonce', async () => {
			// A contract can have nonce=0 and balance=0 but still not be "empty" because it has code
			const contractCode = new Uint8Array([0x60, 0x80, 0x60, 0x40])

			const mockAccount = {
				nonce: 0n,
				balance: 0n,
				storageRoot: new Uint8Array(32),
				codeHash: new Uint8Array(32),
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
					getCode: () => Effect.succeed(contractCode),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.nonce).toBe(0n)
			expect(result.balance).toBe(0n)
			expect(result.isContract).toBe(true)
			expect(result.isEmpty).toBe(false) // Not empty because it has code
		})

		it('should use default 0n when balance is undefined', async () => {
			const mockAccount = {
				nonce: 5n,
				balance: undefined, // undefined balance
				storageRoot: new Uint8Array([1, 2, 3]),
				codeHash: new Uint8Array([4, 5, 6]),
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(mockAccount),
				}) as any,
			)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
					address: '0x1234567890123456789012345678901234567890',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.balance).toBe(0n)
		})
	})

	describe('error handling with Effect.catchTag', () => {
		it('should allow catching InvalidParamsError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = GetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { getAccount } = yield* GetAccountService
				return yield* getAccount({
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
