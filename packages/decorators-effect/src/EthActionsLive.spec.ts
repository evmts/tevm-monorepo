import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer, Exit } from 'effect'
import { EthActionsService } from './EthActionsService.js'
import { EthActionsLive } from './EthActionsLive.js'
import { StateManagerService } from '@tevm/state-effect'
import { VmService } from '@tevm/vm-effect'
import { CommonService } from '@tevm/common-effect'
import { BlockchainService } from '@tevm/blockchain-effect'
import {
	GetBalanceService,
	GetCodeService,
	GetStorageAtService,
} from '@tevm/actions-effect'
import { RevertError, OutOfGasError, InvalidOpcodeError, InternalError } from '@tevm/errors-effect'

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

	const createMockBlockchainService = () => ({
		chain: {} as any,
		getBlock: vi.fn(() => Effect.succeed({ header: { number: 100n } } as any)),
		getBlockByHash: vi.fn(() => Effect.succeed({ header: { number: 100n } } as any)),
		putBlock: vi.fn(() => Effect.succeed(undefined)),
		getCanonicalHeadBlock: vi.fn(() => Effect.succeed({ header: { number: 100n } } as any)),
		getIteratorHead: vi.fn(() => Effect.succeed({ header: { number: 100n } } as any)),
		setIteratorHead: vi.fn(() => Effect.succeed(undefined)),
		delBlock: vi.fn(() => Effect.succeed(undefined)),
		validateHeader: vi.fn(() => Effect.succeed(undefined)),
		deepCopy: vi.fn(() => Effect.succeed({} as any)),
		shallowCopy: vi.fn(() => ({} as any)),
		ready: Effect.succeed(undefined),
		iterator: vi.fn(() => (async function* () {})()),
	})

	const createTestLayer = () => {
		const vmMock = createMockVm()
		const commonMock = createMockCommon()
		const stateManagerMock = createMockStateManager()
		const getBalanceMock = createMockGetBalanceService()
		const getCodeMock = createMockGetCodeService()
		const getStorageAtMock = createMockGetStorageAtService()
		const blockchainMock = createMockBlockchainService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(BlockchainService, blockchainMock as any),
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
				blockchain: blockchainMock,
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

	it('should execute eth_call and return result', async () => {
		const { layer, mocks } = createTestLayer()

		const params = {
			to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			data: '0x1234' as `0x${string}`,
			from: '0x0987654321098765432109876543210987654321' as `0x${string}`,
			gas: 100000n,
			gasPrice: 1000000000n,
			value: 0n,
		}

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x1234')
		expect(mocks.vm.vm.evm.runCall).toHaveBeenCalled()
	})

	it('should handle eth_call with empty data', async () => {
		const { layer, mocks } = createTestLayer()

		// Update mock to return empty result
		mocks.vm.vm.evm.runCall.mockResolvedValueOnce({
			execResult: {
				returnValue: new Uint8Array(),
				executionGasUsed: 21000n,
			},
		})

		const params = {
			to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
		}

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x')
	})

	it('should handle eth_call with odd-length hex data', async () => {
		const { layer } = createTestLayer()

		const params = {
			to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			data: '0x123' as `0x${string}`, // Odd-length hex
		}

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.call(params)
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x1234')
	})

	it('should handle eth_call error from EVM', async () => {
		const vmMock = createMockVm()
		vmMock.vm.evm.runCall.mockRejectedValueOnce(new Error('EVM execution failed'))

		const commonMock = createMockCommon()
		const stateManagerMock = createMockStateManager()
		const getBalanceMock = createMockGetBalanceService()
		const getCodeMock = createMockGetCodeService()
		const getStorageAtMock = createMockGetStorageAtService()
		const blockchainMock = createMockBlockchainService()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(BlockchainService, blockchainMock as any),
			Layer.succeed(GetBalanceService, getBalanceMock as any),
			Layer.succeed(GetCodeService, getCodeMock as any),
			Layer.succeed(GetStorageAtService, getStorageAtMock as any)
		)

		const layer = Layer.provide(EthActionsLive, mockLayer)

		const params = {
			to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			data: '0x1234' as `0x${string}`,
		}

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.call(params)
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	it('should handle blockNumber error from blockchain', async () => {
		const vmMock = createMockVm()
		const commonMock = createMockCommon()
		const stateManagerMock = createMockStateManager()
		const getBalanceMock = createMockGetBalanceService()
		const getCodeMock = createMockGetCodeService()
		const getStorageAtMock = createMockGetStorageAtService()
		const blockchainMock = createMockBlockchainService()

		// Make getCanonicalHeadBlock fail
		blockchainMock.getCanonicalHeadBlock.mockReturnValueOnce(
			Effect.fail(new Error('Blockchain error'))
		)

		const mockLayer = Layer.mergeAll(
			Layer.succeed(StateManagerService, stateManagerMock as any),
			Layer.succeed(VmService, vmMock as any),
			Layer.succeed(CommonService, commonMock as any),
			Layer.succeed(BlockchainService, blockchainMock as any),
			Layer.succeed(GetBalanceService, getBalanceMock as any),
			Layer.succeed(GetCodeService, getCodeMock as any),
			Layer.succeed(GetStorageAtService, getStorageAtMock as any)
		)

		const layer = Layer.provide(EthActionsLive, mockLayer)

		const program = Effect.gen(function* () {
			const ethActions = yield* EthActionsService
			return yield* ethActions.blockNumber()
		})

		const result = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
		expect(result._tag).toBe('Failure')
	})

	describe('EVM execution error handling', () => {
		it('should return RevertError when EVM execution reverts', async () => {
			const vmMock = createMockVm()
			vmMock.vm.evm.runCall.mockResolvedValueOnce({
				execResult: {
					returnValue: new Uint8Array([0x08, 0xc3, 0x79, 0xa0]), // Error selector
					executionGasUsed: 21000n,
					exceptionError: {
						error: 'revert',
						message: 'Insufficient balance',
					},
				},
			})

			const commonMock = createMockCommon()
			const stateManagerMock = createMockStateManager()
			const getBalanceMock = createMockGetBalanceService()
			const getCodeMock = createMockGetCodeService()
			const getStorageAtMock = createMockGetStorageAtService()
			const blockchainMock = createMockBlockchainService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(CommonService, commonMock as any),
				Layer.succeed(BlockchainService, blockchainMock as any),
				Layer.succeed(GetBalanceService, getBalanceMock as any),
				Layer.succeed(GetCodeService, getCodeMock as any),
				Layer.succeed(GetStorageAtService, getStorageAtMock as any)
			)

			const layer = Layer.provide(EthActionsLive, mockLayer)

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0x1234' as `0x${string}`,
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as RevertError
				expect(error._tag).toBe('RevertError')
				expect(error.reason).toBe('Insufficient balance')
				expect(error.raw).toBe('0x08c379a0')
			}
		})

		it('should return OutOfGasError when EVM runs out of gas', async () => {
			const vmMock = createMockVm()
			vmMock.vm.evm.runCall.mockResolvedValueOnce({
				execResult: {
					returnValue: new Uint8Array(),
					executionGasUsed: 100000n,
					exceptionError: {
						error: 'out of gas',
						message: 'Transaction ran out of gas',
					},
				},
			})

			const commonMock = createMockCommon()
			const stateManagerMock = createMockStateManager()
			const getBalanceMock = createMockGetBalanceService()
			const getCodeMock = createMockGetCodeService()
			const getStorageAtMock = createMockGetStorageAtService()
			const blockchainMock = createMockBlockchainService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(CommonService, commonMock as any),
				Layer.succeed(BlockchainService, blockchainMock as any),
				Layer.succeed(GetBalanceService, getBalanceMock as any),
				Layer.succeed(GetCodeService, getCodeMock as any),
				Layer.succeed(GetStorageAtService, getStorageAtMock as any)
			)

			const layer = Layer.provide(EthActionsLive, mockLayer)

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0x1234' as `0x${string}`,
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as OutOfGasError
				expect(error._tag).toBe('OutOfGasError')
				expect(error.message).toBe('Transaction ran out of gas')
			}
		})

		it('should return InvalidOpcodeError when EVM hits invalid opcode', async () => {
			const vmMock = createMockVm()
			vmMock.vm.evm.runCall.mockResolvedValueOnce({
				execResult: {
					returnValue: new Uint8Array(),
					executionGasUsed: 50000n,
					exceptionError: {
						error: 'invalid opcode',
						message: 'Invalid opcode: INVALID',
					},
				},
			})

			const commonMock = createMockCommon()
			const stateManagerMock = createMockStateManager()
			const getBalanceMock = createMockGetBalanceService()
			const getCodeMock = createMockGetCodeService()
			const getStorageAtMock = createMockGetStorageAtService()
			const blockchainMock = createMockBlockchainService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(CommonService, commonMock as any),
				Layer.succeed(BlockchainService, blockchainMock as any),
				Layer.succeed(GetBalanceService, getBalanceMock as any),
				Layer.succeed(GetCodeService, getCodeMock as any),
				Layer.succeed(GetStorageAtService, getStorageAtMock as any)
			)

			const layer = Layer.provide(EthActionsLive, mockLayer)

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0x1234' as `0x${string}`,
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidOpcodeError
				expect(error._tag).toBe('InvalidOpcodeError')
				expect(error.message).toBe('Invalid opcode: INVALID')
			}
		})

		it('should return InternalError for other EVM errors', async () => {
			const vmMock = createMockVm()
			vmMock.vm.evm.runCall.mockResolvedValueOnce({
				execResult: {
					returnValue: new Uint8Array(),
					executionGasUsed: 50000n,
					exceptionError: {
						error: 'stack underflow',
						message: 'Stack underflow at position 0',
					},
				},
			})

			const commonMock = createMockCommon()
			const stateManagerMock = createMockStateManager()
			const getBalanceMock = createMockGetBalanceService()
			const getCodeMock = createMockGetCodeService()
			const getStorageAtMock = createMockGetStorageAtService()
			const blockchainMock = createMockBlockchainService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(CommonService, commonMock as any),
				Layer.succeed(BlockchainService, blockchainMock as any),
				Layer.succeed(GetBalanceService, getBalanceMock as any),
				Layer.succeed(GetCodeService, getCodeMock as any),
				Layer.succeed(GetStorageAtService, getStorageAtMock as any)
			)

			const layer = Layer.provide(EthActionsLive, mockLayer)

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0x1234' as `0x${string}`,
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InternalError
				expect(error._tag).toBe('InternalError')
				expect(error.message).toContain('Stack underflow')
			}
		})

		it('should handle invalid hex in data parameter', async () => {
			const { layer, mocks } = createTestLayer()

			// Make runCall throw due to invalid hex conversion
			mocks.vm.vm.evm.runCall.mockImplementationOnce(() => {
				throw new Error('Invalid hex')
			})

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0xZZZZ' as `0x${string}`, // Invalid hex characters
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should handle revert with empty return data', async () => {
			const vmMock = createMockVm()
			vmMock.vm.evm.runCall.mockResolvedValueOnce({
				execResult: {
					returnValue: new Uint8Array(),
					executionGasUsed: 21000n,
					exceptionError: {
						error: 'revert',
						message: '',
					},
				},
			})

			const commonMock = createMockCommon()
			const stateManagerMock = createMockStateManager()
			const getBalanceMock = createMockGetBalanceService()
			const getCodeMock = createMockGetCodeService()
			const getStorageAtMock = createMockGetStorageAtService()
			const blockchainMock = createMockBlockchainService()

			const mockLayer = Layer.mergeAll(
				Layer.succeed(StateManagerService, stateManagerMock as any),
				Layer.succeed(VmService, vmMock as any),
				Layer.succeed(CommonService, commonMock as any),
				Layer.succeed(BlockchainService, blockchainMock as any),
				Layer.succeed(GetBalanceService, getBalanceMock as any),
				Layer.succeed(GetCodeService, getCodeMock as any),
				Layer.succeed(GetStorageAtService, getStorageAtMock as any)
			)

			const layer = Layer.provide(EthActionsLive, mockLayer)

			const params = {
				to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
				data: '0x1234' as `0x${string}`,
			}

			const program = Effect.gen(function* () {
				const ethActions = yield* EthActionsService
				return yield* ethActions.call(params)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as RevertError
				expect(error._tag).toBe('RevertError')
				expect(error.message).toBe('Execution reverted')
				expect(error.raw).toBeUndefined()
			}
		})
	})
})
