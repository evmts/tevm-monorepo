import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer, Ref } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { MemoryClientLive } from './MemoryClientLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import {
	GetAccountService,
	SetAccountService,
	GetBalanceService,
	GetCodeService,
	GetStorageAtService,
} from '@tevm/actions-effect'
import { SnapshotService } from '@tevm/node-effect'

describe('MemoryClientLive', () => {
	// Create mock implementations for all required services
	const createMockStateManager = () => ({
		getAccount: vi.fn(() => Effect.succeed({ balance: 0n, nonce: 0n, codeHash: '0x', storageRoot: '0x' })),
		putAccount: vi.fn(() => Effect.succeed(undefined)),
		getCode: vi.fn(() => Effect.succeed(new Uint8Array())),
		putCode: vi.fn(() => Effect.succeed(undefined)),
		getStorage: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		putStorage: vi.fn(() => Effect.succeed(undefined)),
		clearStorage: vi.fn(() => Effect.succeed(undefined)),
		checkpoint: vi.fn(() => Effect.succeed(undefined)),
		commit: vi.fn(() => Effect.succeed(undefined)),
		revert: vi.fn(() => Effect.succeed(undefined)),
		getStateRoot: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		setStateRoot: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
	})

	const createMockVm = () => ({
		// The underlying VM instance with blockchain access
		vm: {
			blockchain: {
				getCanonicalHeadBlock: vi.fn(() => Promise.resolve({ header: { number: 100n } })),
			},
			evm: {
				runCall: vi.fn(() => Promise.resolve({ execResult: { returnValue: new Uint8Array() } })),
			},
		},
		runTx: vi.fn(() => Effect.succeed({} as any)),
		runBlock: vi.fn(() => Effect.succeed({} as any)),
		buildBlock: vi.fn(() => Effect.succeed({} as any)),
		ready: Effect.succeed(true),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
	})

	const createMockCommon = () => ({
		chainId: 1,
		hardfork: 'prague' as const,
		eips: [],
		common: {} as any,
		copy: vi.fn(() => ({} as any)),
	})

	const createMockGetAccountService = () => ({
		getAccount: vi.fn((params: any) =>
			Effect.succeed({
				address: params.address,
				nonce: 0n,
				balance: 1000000000000000000n,
				deployedBytecode: '0x',
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
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

	const createMockGetBalanceService = () => ({
		getBalance: vi.fn(() => Effect.succeed(1000000000000000000n)),
	})

	const createMockGetCodeService = () => ({
		getCode: vi.fn(() => Effect.succeed('0x' as const)),
	})

	const createMockGetStorageAtService = () => ({
		getStorageAt: vi.fn(() =>
			Effect.succeed('0x0000000000000000000000000000000000000000000000000000000000000000' as const)
		),
	})

	const createMockSnapshotService = () => ({
		takeSnapshot: vi.fn(() => Effect.succeed('0x1' as const)),
		revertToSnapshot: vi.fn(() => Effect.succeed(true)),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
	})

	const createTestLayer = () => {
		const stateManagerMock = createMockStateManager()
		const vmMock = createMockVm()
		const commonMock = createMockCommon()
		const getAccountMock = createMockGetAccountService()
		const setAccountMock = createMockSetAccountService()
		const getBalanceMock = createMockGetBalanceService()
		const getCodeMock = createMockGetCodeService()
		const getStorageAtMock = createMockGetStorageAtService()
		const snapshotMock = createMockSnapshotService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(GetAccountService, getAccountMock as any),
			Layer.succeed(SetAccountService, setAccountMock as any),
			Layer.succeed(GetBalanceService, getBalanceMock as any),
			Layer.succeed(GetCodeService, getCodeMock as any),
			Layer.succeed(GetStorageAtService, getStorageAtMock as any),
			Layer.succeed(SnapshotService, snapshotMock as any)
		)

		return {
			layer: Layer.provide(MemoryClientLive, mockLayer),
			mocks: {
				stateManager: stateManagerMock,
				vm: vmMock,
				common: commonMock,
				getAccount: getAccountMock,
				setAccount: setAccountMock,
				getBalance: getBalanceMock,
				getCode: getCodeMock,
				getStorageAt: getStorageAtMock,
				snapshot: snapshotMock,
			},
		}
	}

	it('should provide ready state', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.ready
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(true)
	})

	it('should get block number from VM', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getBlockNumber
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(100n)
	})

	it('should get chain ID from common', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getChainId
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(1n)
	})

	it('should delegate getAccount to GetAccountService', async () => {
		const { layer, mocks } = createTestLayer()

		const address = '0x1234567890123456789012345678901234567890' as const

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getAccount({ address })
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
			const client = yield* MemoryClientService
			return yield* client.setAccount(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result.address).toBe(params.address)
		expect(mocks.setAccount.setAccount).toHaveBeenCalledWith(params)
	})

	it('should delegate getBalance to GetBalanceService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
		}

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getBalance(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe(1000000000000000000n)
		expect(mocks.getBalance.getBalance).toHaveBeenCalledWith(params)
	})

	it('should delegate getCode to GetCodeService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
		}

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getCode(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe('0x')
		expect(mocks.getCode.getCode).toHaveBeenCalledWith(params)
	})

	it('should delegate getStorageAt to GetStorageAtService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
			position: '0x0' as const,
		}

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getStorageAt(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		expect(mocks.getStorageAt.getStorageAt).toHaveBeenCalledWith(params)
	})

	it('should delegate takeSnapshot to SnapshotService', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.takeSnapshot()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe('0x1')
		expect(mocks.snapshot.takeSnapshot).toHaveBeenCalled()
	})

	it('should delegate revertToSnapshot to SnapshotService', async () => {
		const { layer, mocks } = createTestLayer()

		const snapshotId = '0x1' as const

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.revertToSnapshot(snapshotId)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe(true)
		expect(mocks.snapshot.revertToSnapshot).toHaveBeenCalledWith(snapshotId)
	})
})
