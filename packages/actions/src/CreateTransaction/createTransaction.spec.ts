import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createTransaction } from './createTransaction.js'

// Mock dependencies
vi.mock('@tevm/node')
vi.mock('@tevm/address', () => ({
	createAddress: vi.fn().mockImplementation((address) => ({
		bytes: new Uint8Array(20),
		isZero: () => false,
		toString: () => (typeof address === 'string' ? address : '0x0000000000000000000000000000000000000000'),
	})),
}))
vi.mock('@tevm/tx', () => ({
	createImpersonatedTx: vi.fn().mockReturnValue({
		hash: () => new Uint8Array([1, 2, 3, 4, 5]),
		maxFeePerGas: 10n,
		maxPriorityFeePerGas: 0n,
		gasLimit: 21000n,
		value: 0n,
	}),
}))
vi.mock('@tevm/utils', () => ({
	bytesToHex: vi.fn().mockReturnValue('0x0102030405'),
	EthjsAccount: class {
		balance = 0n
		nonce = 0n
		storageRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
		codeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
	},
	hexToBytes: vi.fn(),
	parseEther: (value) => 1000000000000000000n,
	EthjsAddress: class {
		constructor() {
			this.bytes = new Uint8Array(20)
			this.isZero = () => false
			this.toString = () => '0x1234567890123456789012345678901234567890'
		}

		static fromString(str) {
			return new this()
		}
	},
}))

describe('createTransaction', () => {
	// Create simplified mocks for required objects
	const mockPoolAdd = vi.fn().mockResolvedValue({ hash: '0x0102030405' })
	const mockPoolRemoveByHash = vi.fn()
	const mockPoolGetBySenderAddress = vi.fn().mockResolvedValue([])

	const mockPool = {
		add: mockPoolAdd,
		removeByHash: mockPoolRemoveByHash,
		getBySenderAddress: mockPoolGetBySenderAddress,
	}

	const mockStateManagerGetAccount = vi.fn().mockResolvedValue({
		balance: 1000000000000000000n, // 1 ETH
		nonce: 0n,
		storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	})

	const mockVm = {
		stateManager: {
			getAccount: mockStateManagerGetAccount,
			revert: vi.fn(),
		},
		blockchain: {
			getCanonicalHeadBlock: vi.fn().mockResolvedValue({
				header: {
					calcNextBaseFee: vi.fn().mockReturnValue(10n),
					baseFeePerGas: 5n,
				},
			}),
		},
		common: {
			ethjsCommon: {
				param: vi.fn().mockImplementation((type, param) => {
					if (type === 'gasPrices') {
						if (param === 'txDataZero') return 4n
						if (param === 'txDataNonZero') return 16n
						if (param === 'tx') return 21000n
						if (param === 'txCreation') return 32000n
					}
					return 0n
				}),
				gteHardfork: vi.fn().mockReturnValue(true),
			},
		},
	}

	// Create a mock client
	const mockClient = {
		getVm: vi.fn().mockResolvedValue(mockVm),
		getTxPool: vi.fn().mockResolvedValue(mockPool),
		logger: {
			debug: vi.fn(),
			error: vi.fn(),
		},
		emit: vi.fn(),
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	/**
	 * Basic success test
	 */
	test('successfully creates a transaction with valid inputs', async () => {
		const createTx = createTransaction(mockClient)

		const testAddress = '0x1234567890123456789012345678901234567890'
		const evmInput = {
			origin: createAddress(testAddress),
			to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
			value: 1000000000000000000n, // 1 ETH
			data: new Uint8Array([1, 2, 3, 4]),
		}

		const evmOutput = {
			execResult: {
				executionGasUsed: 21000n,
				returnValue: new Uint8Array([]),
				gasRefund: 0n,
				exceptionError: undefined,
				gasUsed: 21000n,
			},
		}

		const result = await createTx({ evmInput, evmOutput })

		// Verify transaction was created with expected parameters
		expect(result).toEqual({ txHash: '0x0102030405' })

		// Verify transaction was added to the pool
		expect(mockPool.add).toHaveBeenCalled()

		// Verify 'newPendingTransaction' event is emitted
		expect(mockClient.emit).toHaveBeenCalledWith('newPendingTransaction', expect.anything())
	})

	/**
	 * Test for handling insufficient balance errors
	 */
	test('handles insufficient balance correctly', async () => {
		const createTx = createTransaction(mockClient)

		// Setup an account with zero balance
		mockStateManagerGetAccount.mockResolvedValueOnce({
			balance: 0n,
			nonce: 0n,
			storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		})

		const result = await createTx({
			evmInput: {
				origin: createAddress('0x1234567890123456789012345678901234567890'),
				skipBalance: false, // don't skip balance check
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array([]),
					gasRefund: 0n,
					exceptionError: undefined,
					gasUsed: 21000n,
				},
			},
			throwOnFail: false,
		})

		// Verify an error is returned
		expect(result).toHaveProperty('errors')
		expect(result.errors?.[0]).toHaveProperty('_tag', 'InsufficientBalance')

		// Verify transaction is not added to pool
		expect(mockPool.add).not.toHaveBeenCalled()
	})

	/**
	 * Test for the skipBalance flag
	 */
	test('respects the skipBalance flag', async () => {
		const createTx = createTransaction(mockClient)

		// Setup an account with zero balance
		mockStateManagerGetAccount.mockResolvedValueOnce({
			balance: 0n,
			nonce: 0n,
			storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
		})

		const result = await createTx({
			evmInput: {
				origin: createAddress('0x1234567890123456789012345678901234567890'),
				skipBalance: true, // skip balance check
				to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
				value: 1000000000000000000n, // 1 ETH
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array([]),
					gasRefund: 0n,
					exceptionError: undefined,
					gasUsed: 21000n,
				},
			},
		})

		// Verify transaction creation succeeds despite zero balance
		expect(result).toEqual({ txHash: '0x0102030405' })

		// Verify skipBalance flag is passed to pool.add
		expect(mockPool.add).toHaveBeenCalledWith(expect.anything(), false, true)
	})

	/**
	 * Test for handling unexpected errors
	 */
	test('handles unexpected errors gracefully', async () => {
		const createTx = createTransaction(mockClient)

		// Mock an error from pool.add
		mockPool.add.mockRejectedValueOnce(new Error('Unexpected error'))

		const result = await createTx({
			evmInput: {
				origin: createAddress('0x1234567890123456789012345678901234567890'),
			},
			evmOutput: {
				execResult: {
					executionGasUsed: 21000n,
					returnValue: new Uint8Array([]),
					gasRefund: 0n,
					exceptionError: undefined,
					gasUsed: 21000n,
				},
			},
			throwOnFail: false,
		})

		// Verify error handling occurs
		expect(result).toHaveProperty('errors')
		expect(result.errors?.[0]).toHaveProperty('name', 'UnexpectedError')
		expect(result.errors?.[0]).toHaveProperty('message', 'Unexpected error')

		// Verify cleanup actions are performed
		expect(mockPool.removeByHash).toHaveBeenCalled()
		expect(mockVm.stateManager.revert).toHaveBeenCalled()
	})
})
