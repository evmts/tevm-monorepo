// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { processTx } from './processTx.js'

// Mock the entire @tevm/errors module
vi.mock('@tevm/errors', () => {
	const BaseError = class extends Error {
		constructor(message) {
			super(message)
			this.name = 'BaseError'
		}
	}

	const InvalidGasLimitError = class extends BaseError {
		constructor(message) {
			super(message)
			this.name = 'InvalidGasLimitError'
		}
	}

	return {
		BaseError,
		InvalidGasLimitError,
	}
})

describe('processTx', () => {
	const mockLogger = {
		debug: vi.fn(),
		error: vi.fn(),
	}

	const mockClient = {
		logger: mockLogger,
	}

	const mockTx = {
		hash: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3, 4])),
	}

	const mockReceipts = []

	beforeEach(() => {
		vi.clearAllMocks()
		mockReceipts.length = 0
	})

	it('should successfully add a transaction to the block builder', async () => {
		const mockTxResult = {
			execResult: {},
			receipt: { transactionHash: '0x1234' },
		}

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockResolvedValue(mockTxResult),
		}

		await processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)

		expect(mockBlockBuilder.addTransaction).toHaveBeenCalledWith(mockTx, {
			skipHardForkValidation: true,
		})
		expect(mockLogger.debug).toHaveBeenCalledWith('0x01020304', 'new tx added')
		expect(mockReceipts).toContain(mockTxResult.receipt)
		expect(mockReceipts.length).toBe(1)
	})

	it('should handle out of gas exceptions', async () => {
		const mockTxResult = {
			execResult: {
				exceptionError: { error: 'out of gas' },
				executionGasUsed: 21000n,
			},
			receipt: { transactionHash: '0x1234' },
		}

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockResolvedValue(mockTxResult),
		}

		await processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)

		expect(mockLogger.debug).toHaveBeenCalledWith(21000n, 'out of gas')
		expect(mockLogger.debug).toHaveBeenCalledWith(
			mockTxResult.execResult.exceptionError,
			'There was an exception when building block for tx 0x01020304',
		)
		expect(mockReceipts).toContain(mockTxResult.receipt)
	})

	it('should handle other execution exceptions', async () => {
		const mockTxResult = {
			execResult: {
				exceptionError: { error: 'revert' },
			},
			receipt: { transactionHash: '0x1234' },
		}

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockResolvedValue(mockTxResult),
		}

		await processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)

		expect(mockLogger.debug).toHaveBeenCalledWith(
			mockTxResult.execResult.exceptionError,
			'There was an exception when building block for tx 0x01020304',
		)
		expect(mockReceipts).toContain(mockTxResult.receipt)
	})

	it('should rethrow InvalidGasLimitError', async () => {
		// Import the mocked InvalidGasLimitError class
		const { InvalidGasLimitError } = await import('@tevm/errors')

		const error = new InvalidGasLimitError('Gas limit exceeded')

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockRejectedValue(error),
		}

		await expect(processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)).rejects.toThrow(error)
		expect(mockReceipts.length).toBe(0)
	})

	it('should log and rethrow unexpected errors', async () => {
		const error = new Error('Unexpected error')

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockRejectedValue(error),
		}

		await expect(processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)).rejects.toThrow(Error)
		expect(mockLogger.error).toHaveBeenCalledWith(
			error,
			'There was an unexpected exception when building block for tx 0x01020304',
		)
		expect(mockReceipts.length).toBe(0)
	})

	it('should handle BaseError instances', async () => {
		// Import the mocked BaseError class
		const { BaseError } = await import('@tevm/errors')

		// Create a BaseError instance
		const baseError = new BaseError('Test base error')

		const mockBlockBuilder = {
			addTransaction: vi.fn().mockRejectedValue(baseError),
		}

		// Verify our mocking is correct
		expect(baseError instanceof Error).toBe(true)
		expect(baseError.name).toBe('BaseError')

		// Test that the BaseError is handled and rethrown
		await expect(processTx(mockClient, mockTx, mockBlockBuilder, mockReceipts)).rejects.toThrow(baseError)

		// Verify no error logging occurred (since BaseError is expected)
		expect(mockLogger.error).not.toHaveBeenCalled()
		expect(mockReceipts.length).toBe(0)
	})
})
