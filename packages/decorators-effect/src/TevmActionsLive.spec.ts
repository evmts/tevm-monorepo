import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { TevmActionsService } from './TevmActionsService.js'
import { TevmActionsLive } from './TevmActionsLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { GetAccountService, SetAccountService } from '@tevm/actions-effect'

describe('TevmActionsLive', () => {
	const createMockVm = () => {
		// Create a mock block builder that returns a mock block
		const mockBlockBuilder = {
			build: vi.fn(() => Promise.resolve({ header: { number: 101n } })),
		}

		return {
			// The underlying VM instance with blockchain and evm access
			vm: {
				blockchain: {
					getCanonicalHeadBlock: vi.fn(() => Promise.resolve({ header: { number: 100n } })),
					putBlock: vi.fn(() => Promise.resolve()),
				},
				evm: {
					runCall: vi.fn(() =>
						Promise.resolve({
							execResult: {
								returnValue: new Uint8Array([0x12, 0x34]),
								executionGasUsed: 21000n,
								gas: 79000n,
							},
						})
					),
				},
				buildBlock: vi.fn(() => Promise.resolve(mockBlockBuilder)),
			},
			runTx: vi.fn(() =>
				Effect.succeed({
					returnValue: '0x1234' as const,
					gasUsed: 21000n,
					gas: 79000n,
				})
			),
			runBlock: vi.fn(() => Effect.succeed({})),
			buildBlock: vi.fn(() => Effect.succeed({})),
			ready: Effect.succeed(true),
			deepCopy: vi.fn(() => Effect.succeed({} as any)),
		}
	}

	const createMockStateManager = () => ({
		getAccount: vi.fn(() => Effect.succeed({ balance: 0n, nonce: 0n })),
		putAccount: vi.fn(() => Effect.succeed(undefined)),
		getCode: vi.fn(() => Effect.succeed(new Uint8Array())),
		putCode: vi.fn(() => Effect.succeed(undefined)),
		getStorage: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		putStorage: vi.fn(() => Effect.succeed(undefined)),
		clearStorage: vi.fn(() => Effect.succeed(undefined)),
		checkpoint: vi.fn(() => Effect.succeed(undefined)),
		commit: vi.fn(() => Effect.succeed(undefined)),
		revert: vi.fn(() => Effect.succeed(undefined)),
		getStateRoot: vi.fn(() => Effect.succeed(new Uint8Array([1, 2, 3, 4]))),
		setStateRoot: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
		// New: dumpState returns TevmState format (address -> account data)
		dumpState: vi.fn(() =>
			Effect.succeed({
				'0x1234567890123456789012345678901234567890': {
					nonce: 5n,
					balance: 1000000000000000000n,
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				},
			})
		),
		// New: loadState accepts TevmState format
		loadState: vi.fn(() => Effect.succeed(undefined)),
	})

	const createMockGetAccountService = () => ({
		getAccount: vi.fn((params: any) =>
			Effect.succeed({
				address: params.address,
				nonce: 0n,
				balance: 1000000000000000000n,
				deployedBytecode: '0x' as const,
				storageRoot:
					'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
				codeHash:
					'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
				isContract: false,
				isEmpty: false,
			})
		),
	})

	const createMockSetAccountService = () => ({
		setAccount: vi.fn((params: any) =>
			Effect.succeed({ address: params.address })
		),
	})

	const createTestLayer = () => {
		const vmMock = createMockVm()
		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any)
		)

		return {
			layer: Layer.provide(TevmActionsLive, mockLayer),
			mocks: {
				vm: vmMock,
				stateManager: stateManagerMock,
				getAccount: getAccountMock,
				setAccount: setAccountMock,
			},
		}
	}

	it('should execute call via VM', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			to: '0x1234567890123456789012345678901234567890' as const,
			data: '0x' as const,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.rawData).toBe('0x1234')
		expect(result.executionGasUsed).toBe(21000n)
		expect(mocks.vm.vm.evm.runCall).toHaveBeenCalled()
	})

	it('should delegate getAccount to GetAccountService', async () => {
		const { layer, mocks } = createTestLayer()

		const address = '0x1234567890123456789012345678901234567890' as const

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.getAccount({ address })
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.address).toBe(address)
		expect(result.balance).toBe(1000000000000000000n)
		expect(mocks.getAccount.getAccount).toHaveBeenCalledWith({ address })
	})

	it('should delegate setAccount to SetAccountService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
			balance: 5000000000000000000n,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.setAccount(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.address).toBe(params.address)
		expect(mocks.setAccount.setAccount).toHaveBeenCalledWith(params)
	})

	it('should dump state as JSON with serialized TevmState', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.dumpState()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		// Verify it's valid JSON
		const parsed = JSON.parse(result)
		expect(parsed).toHaveProperty('state')
		expect(parsed.state).toHaveProperty('0x1234567890123456789012345678901234567890')

		// Verify BigInt values were serialized to hex strings
		const account = parsed.state['0x1234567890123456789012345678901234567890']
		expect(account.nonce).toBe('0x5')
		expect(account.balance).toBe('0xde0b6b3a7640000')

		// Verify stateManager.dumpState was called
		expect(mocks.stateManager.dumpState).toHaveBeenCalled()
	})

	it('should load state from JSON with serialized TevmState', async () => {
		const { layer, mocks } = createTestLayer()

		// Create a valid state JSON (as dumpState would produce)
		const stateJson = JSON.stringify({
			state: {
				'0xabcdef1234567890abcdef1234567890abcdef12': {
					nonce: '0xa',
					balance: '0x1bc16d674ec80000',
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				},
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))

		// Verify stateManager.loadState was called with deserialized TevmState
		expect(mocks.stateManager.loadState).toHaveBeenCalled()

		// Verify the state was deserialized correctly (BigInt values restored)
		const loadedState = mocks.stateManager.loadState.mock.calls[0][0]
		expect(loadedState).toHaveProperty('0xabcdef1234567890abcdef1234567890abcdef12')

		const account = loadedState['0xabcdef1234567890abcdef1234567890abcdef12']
		expect(account.nonce).toBe(10n)
		expect(account.balance).toBe(2000000000000000000n)
	})

	it('should mine blocks using vm.vm.buildBlock', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 3 })
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))

		// Verify vm.vm.buildBlock was called 3 times (once per block)
		expect(mocks.vm.vm.buildBlock).toHaveBeenCalledTimes(3)
		// Verify blocks were put into blockchain
		expect(mocks.vm.vm.blockchain.putBlock).toHaveBeenCalledTimes(3)
	})
})
