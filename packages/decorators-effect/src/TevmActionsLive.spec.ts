import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { TevmActionsService } from './TevmActionsService.js'
import { TevmActionsLive } from './TevmActionsLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { GetAccountService, SetAccountService } from '@tevm/actions-effect'

describe('TevmActionsLive', () => {
	const createMockVm = () => ({
		// The underlying VM instance with blockchain and evm access
		vm: {
			blockchain: {
				getCanonicalHeadBlock: vi.fn(() => Promise.resolve({ header: { number: 100n } })),
			},
			evm: {
				runCall: vi.fn(() => Promise.resolve({
					execResult: {
						returnValue: new Uint8Array([0x12, 0x34]),
						executionGasUsed: 21000n,
						gas: 79000n,
					},
				})),
			},
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
	})

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

	it('should dump state as hex string', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.dumpState()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x01020304')
	})

	it('should load state from hex string', async () => {
		const { layer, mocks } = createTestLayer()

		const state = '0x01020304'

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.loadState(state)
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.stateManager.setStateRoot).toHaveBeenCalled()
	})

	it('should mine blocks', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const tevmActions = yield* TevmActionsService
			return yield* tevmActions.mine({ blocks: 3 })
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.vm.buildBlock).toHaveBeenCalledTimes(3)
	})
})
