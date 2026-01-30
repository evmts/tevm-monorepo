import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { EthActionsService } from './EthActionsService.js'
import { EthActionsLive } from './EthActionsLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import {
	GetBalanceService,
	GetCodeService,
	GetStorageAtService,
} from '@tevm/actions-effect'

describe('EthActionsLive', () => {
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
					},
				})),
			},
		},
		runTx: vi.fn(() => Effect.succeed({ returnValue: '0x1234' as const })),
		runBlock: vi.fn(() => Effect.succeed({})),
		buildBlock: vi.fn(() => Effect.succeed({})),
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
		getStateRoot: vi.fn(() => Effect.succeed(new Uint8Array(32))),
		setStateRoot: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
	})

	const createMockGetBalanceService = () => ({
		getBalance: vi.fn(() => Effect.succeed(1000000000000000000n)),
	})

	const createMockGetCodeService = () => ({
		getCode: vi.fn(() => Effect.succeed('0x' as const)),
	})

	const createMockGetStorageAtService = () => ({
		getStorageAt: vi.fn(() =>
			Effect.succeed(
				'0x0000000000000000000000000000000000000000000000000000000000000000' as const
			)
		),
	})

	const createTestLayer = () => {
		const vmMock = createMockVm()
		const commonMock = createMockCommon()
		const stateManagerMock = createMockStateManager()
		const getBalanceMock = createMockGetBalanceService()
		const getCodeMock = createMockGetCodeService()
		const getStorageAtMock = createMockGetStorageAtService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(GetBalanceService, getBalanceMock as any),
			Layer.succeed(GetCodeService, getCodeMock as any),
			Layer.succeed(GetStorageAtService, getStorageAtMock as any)
		)

		return {
			layer: Layer.provide(EthActionsLive, mockLayer),
			mocks: {
				vm: vmMock,
				common: commonMock,
				stateManager: stateManagerMock,
				getBalance: getBalanceMock,
				getCode: getCodeMock,
				getStorageAt: getStorageAtMock,
			},
		}
	}

	it('should get block number from VM', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.blockNumber()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(100n)
	})

	it('should get chain ID from common', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.chainId()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(1n)
	})

	it('should get gas price', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.gasPrice()
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(1000000000n) // 1 gwei default
	})

	it('should delegate getBalance to GetBalanceService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = { address: '0x1234567890123456789012345678901234567890' as const }

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.getBalance(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(1000000000000000000n)
		expect(mocks.getBalance.getBalance).toHaveBeenCalledWith(params)
	})

	it('should delegate getCode to GetCodeService', async () => {
		const { layer, mocks } = createTestLayer()

		const params = { address: '0x1234567890123456789012345678901234567890' as const }

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.getCode(params)
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
			const ethActions = yield* EthActionsService
			return yield* ethActions.getStorageAt(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(
			'0x0000000000000000000000000000000000000000000000000000000000000000'
		)
		expect(mocks.getStorageAt.getStorageAt).toHaveBeenCalledWith(params)
	})
})
