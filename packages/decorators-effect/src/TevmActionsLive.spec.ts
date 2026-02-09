import { GetAccountService, SetAccountService } from '@tevm/actions-effect'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { Effect, Layer } from 'effect'
import { describe, expect, it, vi } from 'vitest'
import { TevmActionsLive } from './TevmActionsLive.js'
import { TevmActionsService } from './TevmActionsService.js'

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
						}),
					),
				},
				buildBlock: vi.fn(() => Promise.resolve(mockBlockBuilder)),
			},
			runTx: vi.fn(() =>
				Effect.succeed({
					returnValue: '0x1234' as const,
					gasUsed: 21000n,
					gas: 79000n,
				}),
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
			}),
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
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
				isContract: false,
				isEmpty: false,
			}),
		),
	})

	const createMockSetAccountService = () => ({
		setAccount: vi.fn((params: any) => Effect.succeed({ address: params.address })),
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
			Layer.succeed(SetAccountService, setAccountMock as any),
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

	it('should mine default 1 block when no options provided', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine()
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(mocks.vm.vm.buildBlock).toHaveBeenCalledTimes(1)
		expect(mocks.vm.vm.blockchain.putBlock).toHaveBeenCalledTimes(1)
	})

	it('should execute call with from parameter', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			to: '0x1234567890123456789012345678901234567890' as const,
			from: '0x0987654321098765432109876543210987654321' as const,
			data: '0x1234' as const,
			gas: 100000n,
			gasPrice: 1000000000n,
			value: 1000n,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.rawData).toBe('0x1234')
		expect(mocks.vm.vm.evm.runCall).toHaveBeenCalled()
	})

	it('should execute call without to parameter (contract creation)', async () => {
		const { layer, mocks: _mocks } = createTestLayer()

		const params = {
			data: '0x60806040' as const,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.rawData).toBe('0x1234')
	})

	it('should handle call with empty data', async () => {
		const { layer, mocks } = createTestLayer()

		// Update mock to return empty result
		mocks.vm.vm.evm.runCall.mockResolvedValueOnce({
			execResult: {
				returnValue: new Uint8Array(),
				executionGasUsed: 21000n,
			},
		})

		const params = {
			to: '0x1234567890123456789012345678901234567890' as const,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.rawData).toBe('0x')
	})

	it('should handle call with odd-length hex data', async () => {
		const { layer } = createTestLayer()

		const params = {
			to: '0x1234567890123456789012345678901234567890' as const,
			data: '0x123' as const, // Odd-length hex
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.rawData).toBeDefined()
	})

	it('should handle call error from EVM', async () => {
		const vmMock = createMockVm()
		vmMock.vm.evm.runCall.mockRejectedValueOnce(new Error('EVM execution failed'))

		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const params = {
			to: '0x1234567890123456789012345678901234567890' as const,
		}

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.call(params)
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle dumpState error from stateManager', async () => {
		const vmMock = createMockVm()
		const stateManagerMock = createMockStateManager()
		stateManagerMock.dumpState.mockReturnValueOnce(Effect.fail(new Error('Dump failed')))

		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.dumpState()
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle loadState JSON parse error', async () => {
		const { layer } = createTestLayer()

		const invalidJson = 'not valid json {'

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(invalidJson)
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle loadState error from stateManager', async () => {
		const vmMock = createMockVm()
		const stateManagerMock = createMockStateManager()
		stateManagerMock.loadState.mockReturnValueOnce(Effect.fail(new Error('Load failed')))

		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const stateJson = JSON.stringify({
			state: {
				'0x1234567890123456789012345678901234567890': {
					nonce: '0x0',
					balance: '0x0',
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				},
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should load state with deployedBytecode and storage', async () => {
		const { layer, mocks } = createTestLayer()

		const stateJson = JSON.stringify({
			state: {
				'0x1234567890123456789012345678901234567890': {
					nonce: '0x1',
					balance: '0x100',
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					deployedBytecode: '0x608060405234801561001057600080fd5b50',
					storage: { '0x0': '0x1' },
				},
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))

		const loadedState = mocks.stateManager.loadState.mock.calls[0][0]
		const account = loadedState['0x1234567890123456789012345678901234567890']
		expect(account.deployedBytecode).toBe('0x608060405234801561001057600080fd5b50')
		expect(account.storage).toEqual({ '0x0': '0x1' })
	})

	it('should load state without .state wrapper', async () => {
		const { layer, mocks } = createTestLayer()

		// State without .state wrapper (fallback parsing)
		const stateJson = JSON.stringify({
			'0x1234567890123456789012345678901234567890': {
				nonce: '0x0',
				balance: '0x0',
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.stateManager.loadState).toHaveBeenCalled()
	})

	it('should handle loadState with missing nonce/balance fields (Issue #76)', async () => {
		const { layer, mocks } = createTestLayer()

		// State with missing nonce and balance - should use defaults
		const stateJson = JSON.stringify({
			'0x1234567890123456789012345678901234567890': {
				// No nonce or balance - should default to 0
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.stateManager.loadState).toHaveBeenCalled()
		const loadedState = mocks.stateManager.loadState.mock.calls[0][0]
		// Verify defaults were applied
		expect(loadedState['0x1234567890123456789012345678901234567890'].nonce).toBe(0n)
		expect(loadedState['0x1234567890123456789012345678901234567890'].balance).toBe(0n)
	})

	it('should handle loadState with missing storageRoot/codeHash fields', async () => {
		const { layer, mocks } = createTestLayer()

		// State with only nonce and balance - should use default hashes
		const stateJson = JSON.stringify({
			'0x1234567890123456789012345678901234567890': {
				nonce: '0x1',
				balance: '0x100',
				// No storageRoot or codeHash - should use defaults
			},
		})

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(stateJson)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.stateManager.loadState).toHaveBeenCalled()
		const loadedState = mocks.stateManager.loadState.mock.calls[0][0]
		// Verify defaults were applied for hashes
		expect(loadedState['0x1234567890123456789012345678901234567890'].storageRoot).toBe(
			'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		)
		expect(loadedState['0x1234567890123456789012345678901234567890'].codeHash).toBe(
			'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		)
	})

	it('should dump state with deployedBytecode and storage', async () => {
		const vmMock = createMockVm()
		const stateManagerMock = createMockStateManager()
		stateManagerMock.dumpState.mockReturnValueOnce(
			Effect.succeed({
				'0x1234567890123456789012345678901234567890': {
					nonce: 1n,
					balance: 100n,
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					deployedBytecode: '0x608060405234801561001057600080fd5b50',
					storage: { '0x0': '0x1' },
				},
			}),
		)

		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.dumpState()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		const parsed = JSON.parse(result)
		expect(parsed.state['0x1234567890123456789012345678901234567890'].deployedBytecode).toBe(
			'0x608060405234801561001057600080fd5b50',
		)
		expect(parsed.state['0x1234567890123456789012345678901234567890'].storage).toEqual({ '0x0': '0x1' })
	})

	it('should handle mine error from getCanonicalHeadBlock', async () => {
		const vmMock = createMockVm()
		vmMock.vm.blockchain.getCanonicalHeadBlock.mockRejectedValueOnce(new Error('Block not found'))

		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 1 })
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle mine error from buildBlock', async () => {
		const vmMock = createMockVm()
		vmMock.vm.buildBlock.mockRejectedValueOnce(new Error('Build failed'))

		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 1 })
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle mine error from block.build()', async () => {
		const vmMock = createMockVm()
		const mockBlockBuilder = {
			build: vi.fn(() => Promise.reject(new Error('Finalize failed'))),
		}
		vmMock.vm.buildBlock.mockResolvedValueOnce(mockBlockBuilder)

		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 1 })
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle mine error from putBlock', async () => {
		const vmMock = createMockVm()
		vmMock.vm.blockchain.putBlock.mockRejectedValueOnce(new Error('Put failed'))

		const stateManagerMock = createMockStateManager()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
		)

		const layer = Layer.provide(TevmActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 1 })
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	describe('mine validation (Issue #74)', () => {
		it('should reject negative blocks parameter', async () => {
			const { layer } = createTestLayer()

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.mine({ blocks: -1 })
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(result._tag).toBe('Failure')
			if (result._tag === 'Failure' && result.cause._tag === 'Fail') {
				expect((result.cause.error as any)._tag).toBe('InvalidParamsError')
			}
		})

		it('should reject non-integer blocks parameter', async () => {
			const { layer } = createTestLayer()

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.mine({ blocks: 1.5 })
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(result._tag).toBe('Failure')
			if (result._tag === 'Failure' && result.cause._tag === 'Fail') {
				expect((result.cause.error as any)._tag).toBe('InvalidParamsError')
			}
		})

		it('should reject blocks parameter exceeding max (1000)', async () => {
			const { layer } = createTestLayer()

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.mine({ blocks: 1001 })
			})

			const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(result._tag).toBe('Failure')
			if (result._tag === 'Failure' && result.cause._tag === 'Fail') {
				expect((result.cause.error as any)._tag).toBe('InvalidParamsError')
				expect((result.cause.error as any).message).toContain('too large')
			}
		})

		it('should use parent timestamp + 1 when parent has future timestamp (Issue #58)', async () => {
			// Parent block has a timestamp 100 seconds in the future
			const futureTimestamp = BigInt(Math.floor(Date.now() / 1000)) + 100n

			let capturedTimestamp: bigint | undefined

			const mockBlockBuilder = {
				build: vi.fn(() => Promise.resolve({ header: { number: 101n, timestamp: futureTimestamp + 1n } })),
			}

			const vmMock = {
				vm: {
					blockchain: {
						getCanonicalHeadBlock: vi.fn(() =>
							Promise.resolve({
								header: { number: 100n, timestamp: futureTimestamp },
							}),
						),
						putBlock: vi.fn(() => Promise.resolve()),
					},
					evm: {
						runCall: vi.fn(() => Promise.resolve({ execResult: { returnValue: new Uint8Array() } })),
					},
					buildBlock: vi.fn((opts: any) => {
						capturedTimestamp = opts.headerData?.timestamp
						return Promise.resolve(mockBlockBuilder)
					}),
					common: {},
				},
				runTx: vi.fn(() => Effect.succeed({})),
				runBlock: vi.fn(() => Effect.succeed({})),
				buildBlock: vi.fn(() => Effect.succeed({})),
				ready: Effect.succeed(true),
				deepCopy: vi.fn(() => Effect.succeed({} as any)),
			}

			const stateManagerMock = createMockStateManager()
			const getAccountMock = createMockGetAccountService()
			const setAccountMock = createMockSetAccountService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(GetAccountService, getAccountMock as any),
				Layer.succeed(SetAccountService, setAccountMock as any),
			)

			const layer = Layer.provide(TevmActionsLive, mockLayer)

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.mine({ blocks: 1 })
			})

			await Effect.runPromise(program.pipe(Effect.provide(layer)))

			// The timestamp should be parent + 1, not current time (which is 100 seconds behind)
			expect(capturedTimestamp).toBeDefined()
			expect(capturedTimestamp!).toBeGreaterThan(futureTimestamp)
		})
	})

	describe('hexToBytes validation (Issue #268)', () => {
		it('should return InvalidParamsError for invalid hex data in tevm_call', async () => {
			const { layer } = createTestLayer()

			const params = {
				to: '0x1234567890123456789012345678901234567890',
				data: '0xgg1234', // Invalid hex characters
			}

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.call(params as any)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(exit._tag).toBe('Failure')
			if (exit._tag === 'Failure' && exit.cause._tag === 'Fail') {
				const error = exit.cause.error
				expect(error._tag).toBe('InvalidParamsError')
				expect((error as any).message).toContain("Invalid 'data' hex")
				expect((error as any).method).toBe('tevm_call')
			}
		})

		it('should return InvalidParamsError for hex with spaces in tevm_call', async () => {
			const { layer } = createTestLayer()

			const params = {
				to: '0x1234567890123456789012345678901234567890',
				data: '0x12 34', // Hex with invalid space character
			}

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.call(params as any)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(exit._tag).toBe('Failure')
			if (exit._tag === 'Failure' && exit.cause._tag === 'Fail') {
				const error = exit.cause.error
				expect(error._tag).toBe('InvalidParamsError')
				expect((error as any).message).toContain("Invalid 'data' hex")
			}
		})
	})

	describe('address validation (Issue #163)', () => {
		it('should return InvalidParamsError for invalid to address in tevm_call', async () => {
			const { layer } = createTestLayer()

			const params = {
				to: 'invalid-address', // Invalid address
				data: '0x1234',
			}

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.call(params as any)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(exit._tag).toBe('Failure')
			if (exit._tag === 'Failure' && exit.cause._tag === 'Fail') {
				const error = exit.cause.error
				expect(error._tag).toBe('InvalidParamsError')
				expect((error as any).message).toContain("Invalid 'to' address")
				expect((error as any).method).toBe('tevm_call')
			}
		})

		it('should return InvalidParamsError for invalid from address in tevm_call', async () => {
			const { layer } = createTestLayer()

			const params = {
				to: '0x1234567890123456789012345678901234567890',
				data: '0x1234',
				from: 'not-a-valid-hex-address', // Invalid from address
			}

			const program = Effect.gen(function* () {
				const tevmActions = yield* TevmActionsService
				return yield* tevmActions.call(params as any)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(exit._tag).toBe('Failure')
			if (exit._tag === 'Failure' && exit.cause._tag === 'Fail') {
				const error = exit.cause.error
				expect(error._tag).toBe('InvalidParamsError')
				expect((error as any).message).toContain("Invalid 'from' address")
				expect((error as any).method).toBe('tevm_call')
			}
		})
	})
})
