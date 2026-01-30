import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { SetAccountService } from './SetAccountService.js'
import { SetAccountLive } from './SetAccountLive.js'
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

describe('SetAccountLive', () => {
	describe('layer composition', () => {
		it('should create a valid Layer', () => {
			expect(SetAccountLive).toBeDefined()
		})

		it('should provide SetAccountService when given StateManagerService', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const service = yield* SetAccountService
				expect(service).toBeDefined()
				expect(typeof service.setAccount).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(true)
		})
	})

	describe('setAccount', () => {
		it('should set account with balance only', async () => {
			const putAccountMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: putAccountMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 1000000000000000000n, // 1 ETH
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(putAccountMock).toHaveBeenCalled()
		})

		it('should set account with nonce', async () => {
			const putAccountMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: putAccountMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					nonce: 5n,
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should set account with deployedBytecode', async () => {
			const putAccountMock = vi.fn(() => Effect.succeed(undefined))
			const putCodeMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: putAccountMock,
					putCode: putCodeMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: '0x608060405234801561001057600080fd5b50',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(putCodeMock).toHaveBeenCalled()
		})

		it('should set account with storageRoot', async () => {
			const putAccountMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: putAccountMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should set account with state (clears storage first)', async () => {
			const clearStorageMock = vi.fn(() => Effect.succeed(undefined))
			const putStorageMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					clearStorage: clearStorageMock,
					putStorage: putStorageMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000064',
					},
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(clearStorageMock).toHaveBeenCalled() // state should clear storage first
			expect(putStorageMock).toHaveBeenCalled()
		})

		it('should set account with stateDiff (does not clear storage)', async () => {
			const clearStorageMock = vi.fn(() => Effect.succeed(undefined))
			const putStorageMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					clearStorage: clearStorageMock,
					putStorage: putStorageMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000064',
					},
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(clearStorageMock).not.toHaveBeenCalled() // stateDiff should NOT clear storage
			expect(putStorageMock).toHaveBeenCalled()
		})

		it('should merge with existing account values', async () => {
			const existingAccount = {
				nonce: 10n,
				balance: 5000n,
				storageRoot: new Uint8Array(32),
				codeHash: new Uint8Array(32),
			}

			const putAccountMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(existingAccount),
					putAccount: putAccountMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				// Only set balance, nonce should be preserved from existing
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 1000n,
				})
			})

			await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			// Check that putAccount was called with merged values
			expect(putAccountMock).toHaveBeenCalled()
			const putAccountCall = putAccountMock.mock.calls[0]
			expect(putAccountCall[1].nonce).toBe(10n) // preserved from existing
			expect(putAccountCall[1].balance).toBe(1000n) // updated
		})
	})

	describe('validation', () => {
		it('should fail with InvalidParamsError for invalid address format', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: 'invalid-address' as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for missing address', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: undefined as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for address with wrong length', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234', // Too short
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail when both state and stateDiff are provided', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: { '0x01': '0x02' },
					stateDiff: { '0x03': '0x04' },
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for non-hex deployedBytecode', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: 'not-hex' as any,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for negative balance', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: -100n,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for negative nonce', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					nonce: -5n,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for non-bigint balance', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 100 as any, // number instead of bigint
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for invalid hex in deployedBytecode', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: '0xGGGG', // Invalid hex chars
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for storage key without 0x prefix', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: {
						'1234': '0xabcd', // Key missing 0x prefix
					},
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for storage key with invalid hex chars', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {
						'0xGGGG': '0xabcd', // Invalid hex chars in key
					},
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for storage value without 0x prefix', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001': 'abcd', // Value missing 0x prefix
					},
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should fail with InvalidParamsError for storage value with invalid hex chars', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {
						'0x0000000000000000000000000000000000000000000000000000000000000001': '0xZZZZ', // Invalid hex chars in value
					},
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})
	})

	describe('error handling', () => {
		it('should wrap putAccount failures in InternalError', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: () => Effect.fail(new Error('DB write failed')),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 100n,
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should wrap putCode failures in InternalError', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putCode: () => Effect.fail(new Error('Code storage failed')),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: '0x60606040',
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should wrap clearStorage failures in InternalError', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					clearStorage: () => Effect.fail(new Error('Clear storage failed')),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: { '0x01': '0x02' },
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should wrap putStorage failures in InternalError', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putStorage: () => Effect.fail(new Error('Storage write failed')),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: { '0x01': '0x02' },
				})
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(testLayer)))

			expect(result._tag).toBe('Failure')
		})

		it('should allow catching InvalidParamsError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
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

		it('should allow catching InternalError with Effect.catchTag', async () => {
			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putAccount: () => Effect.fail(new Error('DB error')),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 100n,
				})
			}).pipe(
				Effect.catchTag('InternalError', (error) =>
					Effect.succeed({
						caught: true,
						errorMessage: error.message,
					}),
				),
			)

			const result = (await Effect.runPromise(program.pipe(Effect.provide(testLayer)))) as any

			expect(result.caught).toBe(true)
			expect(result.errorMessage).toContain('Failed to put account')
		})
	})

	describe('edge cases for branch coverage', () => {
		it('should handle undefined balance by using existing or default', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					// No balance provided
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should handle undefined nonce by using existing or default', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 100n,
					// No nonce provided
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should lowercase the address in the result', async () => {
			const MockStateManagerLayer = Layer.succeed(StateManagerService, createMockStateManager() as any)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0xabcdef1234567890abcdef1234567890abcdef12')
		})

		it('should handle empty state object', async () => {
			const clearStorageMock = vi.fn(() => Effect.succeed(undefined))
			const putStorageMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					clearStorage: clearStorageMock,
					putStorage: putStorageMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					state: {}, // Empty state
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(clearStorageMock).toHaveBeenCalled() // Should still clear
			expect(putStorageMock).not.toHaveBeenCalled() // No storage to put
		})

		it('should handle empty stateDiff object', async () => {
			const clearStorageMock = vi.fn(() => Effect.succeed(undefined))
			const putStorageMock = vi.fn(() => Effect.succeed(undefined))

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					clearStorage: clearStorageMock,
					putStorage: putStorageMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {}, // Empty stateDiff
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(clearStorageMock).not.toHaveBeenCalled() // stateDiff doesn't clear
			expect(putStorageMock).not.toHaveBeenCalled() // No storage to put
		})

		it('should use existing storageRoot when not provided', async () => {
			// storageRoot must be exactly 32 bytes for createAccount() validation
			const existingAccount = {
				nonce: 1n,
				balance: 100n,
				storageRoot: new Uint8Array(32).fill(1), // 32-byte storage root
				codeHash: undefined,
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(existingAccount),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 200n,
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should use existing codeHash when not providing deployedBytecode', async () => {
			// codeHash must be exactly 32 bytes for createAccount() validation
			const existingAccount = {
				nonce: 1n,
				balance: 100n,
				storageRoot: undefined,
				codeHash: new Uint8Array(32).fill(2), // 32-byte code hash
			}

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					getAccount: () => Effect.succeed(existingAccount),
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					balance: 200n,
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should correctly handle odd-length hex values in storage (not truncate)', async () => {
			// This tests the hexToBytes fix for odd-length hex strings
			// Before the fix, "0xabc" would be truncated to [0xab] (losing the 'c' nibble)
			// After the fix, "0xabc" is normalized to "0x0abc" -> [0x0a, 0xbc]
			let capturedKeyBytes: Uint8Array | undefined
			let capturedValueBytes: Uint8Array | undefined

			const putStorageMock = vi.fn((address: any, key: Uint8Array, value: Uint8Array) => {
				capturedKeyBytes = key
				capturedValueBytes = value
				return Effect.succeed(undefined)
			})

			const MockStateManagerLayer = Layer.succeed(
				StateManagerService,
				createMockStateManager({
					putStorage: putStorageMock,
				}) as any,
			)
			const testLayer = SetAccountLive.pipe(Layer.provide(MockStateManagerLayer))

			const program = Effect.gen(function* () {
				const { setAccount } = yield* SetAccountService
				return yield* setAccount({
					address: '0x1234567890123456789012345678901234567890',
					// Using odd-length hex value (3 hex chars after 0x)
					stateDiff: {
						'0x0000000000000000000000000000000000000000000000000000000000000001': '0xabc',
					},
				})
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))

			expect(result.address).toBe('0x1234567890123456789012345678901234567890')
			expect(putStorageMock).toHaveBeenCalled()

			// The value "0xabc" should be normalized to "0x0abc" and converted correctly
			// After fix: "0xabc" -> "0abc" (normalized) -> [0x0a, 0xbc] (2 bytes)
			// Before fix (bug): "0xabc" -> "abc" -> [0xab] (1 byte, 'c' lost)
			expect(capturedValueBytes).toBeDefined()
			if (capturedValueBytes) {
				// Value should be 32 bytes (padded), but the significant bytes at the end should be [0x0a, 0xbc]
				// Since the value is left-padded to 32 bytes, check last 2 bytes
				const lastTwo = capturedValueBytes.slice(-2)
				expect(lastTwo[0]).toBe(0x0a) // First nibble 0, second nibble a
				expect(lastTwo[1]).toBe(0xbc) // bc as expected
			}
		})
	})
})
