import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer, Ref } from 'effect'
import { MemoryClientService } from './MemoryClientService.js'
import { MemoryClientLive } from './MemoryClientLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import { SnapshotService } from '@tevm/node-effect'

describe('MemoryClientLive', () => {
	// Create mock implementations for all required services
	// Note: Action services are now created inline in MemoryClientLive,
	// so tests should verify behavior through the StateManagerService mock
	const createMockStateManager = () => ({
		getAccount: vi.fn(() =>
			Effect.succeed({
				nonce: 5n,
				balance: 1000000000000000000n,
				codeHash: new Uint8Array([0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c, 0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0, 0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b, 0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70]),
				storageRoot: new Uint8Array([0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6, 0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e, 0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0, 0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21]),
			})
		),
		putAccount: vi.fn(() => Effect.succeed(undefined)),
		getCode: vi.fn(() => Effect.succeed(new Uint8Array([0x60, 0x80, 0x60, 0x40]))),
		putCode: vi.fn(() => Effect.succeed(undefined)),
		getStorage: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		putStorage: vi.fn(() => Effect.succeed(undefined)),
		clearStorage: vi.fn(() => Effect.succeed(undefined)),
		checkpoint: vi.fn(() => Effect.succeed(undefined)),
		commit: vi.fn(() => Effect.succeed(undefined)),
		revert: vi.fn(() => Effect.succeed(undefined)),
		getStateRoot: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		setStateRoot: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() =>
			Effect.succeed({
				getAccount: vi.fn(() => Effect.succeed(null)),
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
			} as any)
		),
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
		deepCopy: vi.fn(() =>
			Effect.succeed({
				vm: {
					blockchain: {
						getCanonicalHeadBlock: vi.fn(() => Promise.resolve({ header: { number: 101n } })),
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
			} as any)
		),
	})

	const createMockCommon = () => ({
		chainId: 1,
		hardfork: 'prague' as const,
		eips: [],
		common: {} as any,
		copy: vi.fn(() => ({} as any)),
	})

	const createMockSnapshotService = () => ({
		takeSnapshot: vi.fn(() => Effect.succeed('0x1' as const)),
		revertToSnapshot: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() =>
			Effect.succeed({
				takeSnapshot: vi.fn(() => Effect.succeed('0x2' as const)),
				revertToSnapshot: vi.fn(() => Effect.succeed(undefined)),
				deepCopy: vi.fn(() => Effect.succeed({} as any)),
			} as any)
		),
	})

	const createTestLayer = () => {
		const stateManagerMock = createMockStateManager()
		const vmMock = createMockVm()
		const commonMock = createMockCommon()
		const snapshotMock = createMockSnapshotService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(SnapshotService, snapshotMock as any)
		)

		return {
			layer: Layer.provide(MemoryClientLive, mockLayer),
			mocks: {
				stateManager: stateManagerMock,
				vm: vmMock,
				common: commonMock,
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

	it('should get account using inline action service', async () => {
		const { layer, mocks } = createTestLayer()

		const address = '0x1234567890123456789012345678901234567890' as const

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getAccount({ address })
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result.address).toBe(address)
		expect(result.balance).toBe(1000000000000000000n)
		expect(result.nonce).toBe(5n)
		expect(result.isContract).toBe(true) // because mock getCode returns bytecode
		// Verify stateManager was called (not delegated to external service)
		expect(mocks.stateManager.getAccount).toHaveBeenCalled()
		expect(mocks.stateManager.getCode).toHaveBeenCalled()
	})

	it('should set account using inline action service', async () => {
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
		// Verify stateManager was called with checkpoint/commit pattern
		expect(mocks.stateManager.checkpoint).toHaveBeenCalled()
		expect(mocks.stateManager.putAccount).toHaveBeenCalled()
		expect(mocks.stateManager.commit).toHaveBeenCalled()
	})

	it('should get balance using inline action service', async () => {
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
		// Verify stateManager.getAccount was called
		expect(mocks.stateManager.getAccount).toHaveBeenCalled()
	})

	it('should get code using inline action service', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			address: '0x1234567890123456789012345678901234567890' as const,
		}

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getCode(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe('0x60806040')
		// Verify stateManager.getCode was called
		expect(mocks.stateManager.getCode).toHaveBeenCalled()
	})

	it('should get storage at using inline action service', async () => {
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
		// Verify stateManager.getStorage was called
		expect(mocks.stateManager.getStorage).toHaveBeenCalled()
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

		// revertToSnapshot now returns void, not boolean
		await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(mocks.snapshot.revertToSnapshot).toHaveBeenCalledWith(snapshotId)
	})

	it('should create a deep copy with fresh inline action services', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			const copy = yield* client.deepCopy()
			// The copy should have its own action services bound to the copied state
			const isReady = yield* copy.ready
			return isReady
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))

		expect(result).toBe(true)
	})

	it('should validate address in getAccount', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.getAccount({ address: 'invalid-address' as any })
		})

		await expect(Effect.runPromise(program.pipe(Effect.provide(layer)))).rejects.toThrow('Invalid address')
	})

	it('should validate address in setAccount', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const client = yield* MemoryClientService
			return yield* client.setAccount({ address: 'not-an-address' as any })
		})

		await expect(Effect.runPromise(program.pipe(Effect.provide(layer)))).rejects.toThrow('Invalid address')
	})
})
