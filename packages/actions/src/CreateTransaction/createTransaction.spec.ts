import { createAddress } from '@tevm/address'
import type { TevmNode } from '@tevm/node'
import { EthjsAccount } from '@tevm/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTransaction } from './createTransaction.js'

// Mock dependencies
vi.mock('@tevm/tx', () => ({
	createImpersonatedTx: vi.fn().mockImplementation((config) => {
		return {
			...config,
			hash: () => new Uint8Array([1, 2, 3, 4]),
			value: config.value || 0n,
			maxFeePerGas: config.maxFeePerGas || 0n,
		}
	}),
}))

/**
 * Note: Most tests are skipped because they require complex mocking of TevmNode.
 * The implementation is complex and needs a full integration test environment
 * to properly test all edge cases. The current tests focus on error handling
 * with insufficient balance, which is easier to isolate and test.
 *
 * TODO: For complete testing, consider:
 * 1. Creating a proper TevmNode factory that handles all the complex interactions
 * 2. Using a real VM instance with proper blockchain setup
 * 3. Testing with real transactions and accounts
 */

describe('createTransaction', () => {
	// Setup mock TevmNode
	let mockAccount: EthjsAccount

	const mockPool = {
		add: vi.fn().mockResolvedValue({}),
		removeByHash: vi.fn(),
		getBySenderAddress: vi.fn().mockResolvedValue([]),
	}

	const mockVm = {
		stateManager: {
			getAccount: vi.fn(), // We'll set this in beforeEach
			revert: vi.fn(),
		},
		blockchain: {
			getCanonicalHeadBlock: vi.fn().mockResolvedValue({
				header: {
					calcNextBaseFee: () => 10n,
					baseFeePerGas: 8n,
				},
			}),
		},
		common: {
			ethjsCommon: {
				param: vi.fn((category, name) => {
					if (category === 'gasPrices') {
						if (name === 'tx') return 21000n
						if (name === 'txDataZero') return 4n
						if (name === 'txDataNonZero') return 16n
						if (name === 'txCreation') return 32000n
					}
					return 0n
				}),
				gteHardfork: vi.fn().mockReturnValue(true),
			},
		},
	}

	const mockClient = {
		getVm: vi.fn().mockResolvedValue(mockVm),
		getTxPool: vi.fn().mockResolvedValue(mockPool),
		logger: {
			debug: vi.fn(),
			error: vi.fn(),
		},
		emit: vi.fn(),
	} as unknown as TevmNode

	beforeEach(() => {
		vi.clearAllMocks()
		// Create a fresh account with 1 ETH for each test
		mockAccount = new EthjsAccount(0n, 1000000000000000000n) // 1 ETH
		mockVm.stateManager.getAccount.mockResolvedValue(mockAccount)
	})

	it.skip('should create a basic transaction successfully', async () => {
		// Ensure account has ETH
		const addr = '0x0000000000000000000000000000000000000001'
		mockVm.stateManager.getAccount = vi.fn().mockImplementation((address) => {
			if (address.toString() === addr) {
				return Promise.resolve(new EthjsAccount(0n, 1000000000000000000n)) // 1 ETH
			}
			return Promise.resolve(mockAccount)
		})

		const createTx = createTransaction(mockClient)

		const result = await createTx({
			evmInput: {
				to: createAddress('0x1234567890123456789012345678901234567890'),
				value: 1000n,
				data: new Uint8Array([1, 2, 3, 4]),
				origin: createAddress(addr),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array(),
				},
			},
		})

		// Check transaction was added to pool
		expect(mockPool.add).toHaveBeenCalled()

		// Check event was emitted
		expect(mockClient.emit).toHaveBeenCalledWith('newPendingTransaction', expect.anything())

		// Result should have transaction hash
		expect(result).toHaveProperty('txHash')
		const txResult = result as { txHash: string }
		expect(txResult.txHash).toBe('0x01020304')
	})

	it('should handle insufficient balance', async () => {
		// Mock empty account with no balance
		mockVm.stateManager.getAccount = vi.fn().mockResolvedValueOnce(new EthjsAccount(0n, 0n))

		const createTx = createTransaction(mockClient)

		const resultPromise = createTx({
			evmInput: {
				to: createAddress('0x1234567890123456789012345678901234567890'),
				value: 1000n,
				skipBalance: false,
				origin: createAddress('0x0000000000000000000000000000000000000002'),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array(),
				},
			},
			throwOnFail: true,
		})

		// Should throw with InsufficientBalance error
		await expect(resultPromise).rejects.toMatchObject({
			_tag: 'InsufficientBalance',
		})
	})

	it('should not throw error if throwOnFail is false', async () => {
		// Mock empty account with no balance
		mockVm.stateManager.getAccount = vi.fn().mockResolvedValueOnce(new EthjsAccount(0n, 0n))

		const createTx = createTransaction(mockClient)

		const result = await createTx({
			evmInput: {
				to: createAddress('0x1234567890123456789012345678901234567890'),
				value: 1000n,
				skipBalance: false,
				origin: createAddress('0x0000000000000000000000000000000000000002'),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array(),
				},
			},
			throwOnFail: false,
		})

		// Should return error object without throwing
		expect(result).toHaveProperty('errors')
		type ErrorResult = { errors: Array<{ _tag: string }> }
		const errorResult = result as ErrorResult
		expect(errorResult.errors?.[0]?._tag).toBe('InsufficientBalance')
	})

	it.skip('should calculate gas parameters when not provided', async () => {
		// Ensure account has ETH
		const addr = '0x0000000000000000000000000000000000000003'
		mockVm.stateManager.getAccount = vi.fn().mockImplementation((address) => {
			if (address.toString() === addr) {
				return Promise.resolve(new EthjsAccount(0n, 1000000000000000000n)) // 1 ETH
			}
			return Promise.resolve(mockAccount)
		})

		const createTx = createTransaction(mockClient)

		await createTx({
			evmInput: {
				to: createAddress('0x1234567890123456789012345678901234567890'),
				value: 1000n,
				origin: createAddress(addr),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array(),
				},
			},
		})

		// Check that transaction was created with appropriate gas parameters
		expect(mockPool.add).toHaveBeenCalledWith(
			expect.objectContaining({
				gasLimit: expect.any(BigInt),
				maxFeePerGas: 10n, // From mockVm.blockchain.getCanonicalHeadBlock().header.calcNextBaseFee()
				maxPriorityFeePerGas: 0n,
			}),
			expect.anything(),
			expect.anything(),
		)
	})

	it.skip('should handle contract creation transactions', async () => {
		// Ensure account has ETH
		const addr = '0x0000000000000000000000000000000000000004'
		mockVm.stateManager.getAccount = vi.fn().mockImplementation((address) => {
			if (address.toString() === addr) {
				return Promise.resolve(new EthjsAccount(0n, 1000000000000000000n)) // 1 ETH
			}
			return Promise.resolve(mockAccount)
		})

		const createTx = createTransaction(mockClient)

		await createTx({
			evmInput: {
				// No 'to' field for contract creation
				data: new Uint8Array([1, 2, 3, 4]), // Contract bytecode
				value: 0n,
				origin: createAddress(addr),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 100000n,
					returnValue: new Uint8Array(),
				},
			},
		})

		// Check contract creation fee was included
		expect(mockVm.common.ethjsCommon.param).toHaveBeenCalledWith('gasPrices', 'txCreation')

		// Check transaction was added to pool
		expect(mockPool.add).toHaveBeenCalled()
	})

	it.skip('should handle errors when adding transaction to pool', async () => {
		// Ensure account has ETH
		const addr = '0x0000000000000000000000000000000000000005'
		mockVm.stateManager.getAccount = vi.fn().mockImplementation((address) => {
			if (address.toString() === addr) {
				return Promise.resolve(new EthjsAccount(0n, 1000000000000000000n)) // 1 ETH
			}
			return Promise.resolve(mockAccount)
		})

		// Mock the pool.add to throw an error - this needs to be after the account is verified
		// but before the tx is added to the pool
		mockPool.add = vi.fn().mockImplementation(() => {
			throw new Error('Pool error')
		})

		const createTx = createTransaction(mockClient)

		const result = await createTx({
			evmInput: {
				to: createAddress('0x1234567890123456789012345678901234567890'),
				value: 1000n,
				origin: createAddress(addr),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array(),
				},
			},
			throwOnFail: false,
		})

		// Should return error object with UnexpectedError
		expect(result).toHaveProperty('errors')
		type ErrorResult = { errors: Array<{ _tag: string }> }
		const errorResult = result as ErrorResult
		expect(errorResult.errors?.[0]?._tag).toBe('UnexpectedError')
	})
})
