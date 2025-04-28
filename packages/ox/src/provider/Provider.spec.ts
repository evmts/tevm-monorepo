import { Effect } from 'effect'
import Ox from 'ox'
import { describe, expect, it, vi } from 'vitest'
import * as Provider from './Provider.js'

vi.mock('ox', () => {
	return {
		default: {
			Provider: {
				getBlockNumber: vi.fn(),
				getChainId: vi.fn(),
				getGasPrice: vi.fn(),
				getBalance: vi.fn(),
				getCode: vi.fn(),
				getStorageAt: vi.fn(),
				getTransactionCount: vi.fn(),
				getTransaction: vi.fn(),
				getTransactionReceipt: vi.fn(),
				getLogs: vi.fn(),
				estimateGas: vi.fn(),
				getBlock: vi.fn(),
				getBlockWithTransactions: vi.fn(),
			},
		},
	}
})

describe('Provider', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('getBlockNumber', () => {
		it('should get block number successfully', async () => {
			const mockBlockNumber = 12345n

			vi.mocked(Ox.Provider.getBlockNumber).mockReturnValue(mockBlockNumber)

			const result = await Effect.runPromise(Provider.getBlockNumber())

			expect(Ox.Provider.getBlockNumber).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockBlockNumber)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to get block number')
			vi.mocked(Ox.Provider.getBlockNumber).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getBlockNumber()

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetBlockNumberError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetBlockNumberError',
				_tag: 'GetBlockNumberError',
				cause: error,
			})
		})
	})

	describe('getChainId', () => {
		it('should get chain ID successfully', async () => {
			const mockChainId = 1

			vi.mocked(Ox.Provider.getChainId).mockReturnValue(mockChainId)

			const result = await Effect.runPromise(Provider.getChainId())

			expect(Ox.Provider.getChainId).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockChainId)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to get chain ID')
			vi.mocked(Ox.Provider.getChainId).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getChainId()

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetChainIdError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetChainIdError',
				_tag: 'GetChainIdError',
				cause: error,
			})
		})
	})

	describe('getGasPrice', () => {
		it('should get gas price successfully', async () => {
			const mockGasPrice = 2000000000n

			vi.mocked(Ox.Provider.getGasPrice).mockReturnValue(mockGasPrice)

			const result = await Effect.runPromise(Provider.getGasPrice())

			expect(Ox.Provider.getGasPrice).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockGasPrice)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to get gas price')
			vi.mocked(Ox.Provider.getGasPrice).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getGasPrice()

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetGasPriceError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetGasPriceError',
				_tag: 'GetGasPriceError',
				cause: error,
			})
		})
	})

	describe('getBalance', () => {
		it('should get balance successfully', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const mockBalance = 1000000000000000000n

			vi.mocked(Ox.Provider.getBalance).mockReturnValue(mockBalance)

			const result = await Effect.runPromise(Provider.getBalance(address))

			expect(Ox.Provider.getBalance).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getBalance).toHaveBeenCalledWith(address)
			expect(result).toEqual(mockBalance)
		})

		it('should handle errors', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const error = new Error('Failed to get balance')
			vi.mocked(Ox.Provider.getBalance).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getBalance(address)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetBalanceError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetBalanceError',
				_tag: 'GetBalanceError',
				cause: error,
			})
		})
	})

	describe('getCode', () => {
		it('should get code successfully', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const mockCode =
				'0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063771602f71461003b578063b67d77c51461006b575b600080fd5b61005560048036038101906100509190610135565b61009b565b6040516100629190610190565b60405180910390f35b61008560048036038101906100809190610135565b6100b1565b6040516100929190610190565b60405180910390f35b6000818301905092915050565b6000818303905092915050565b600080fd5b6000819050919050565b6100d8816100c5565b81146100e357600080fd5b50565b6000813590506100f5816100cf565b92915050565b600080fd5b61010a816100c5565b811461011557600080fd5b50565b60008135905061012781610101565b92915050565b6000806040838503121561014c5761014b6100c0565b5b600061015a858286016100e6565b925050602061016b85828601610118565b9150509250929050565b61017e816100c5565b82525050565b60006020820190506101996000830184610175565b9291505056fe'

			vi.mocked(Ox.Provider.getCode).mockReturnValue(mockCode)

			const result = await Effect.runPromise(Provider.getCode(address))

			expect(Ox.Provider.getCode).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getCode).toHaveBeenCalledWith(address)
			expect(result).toEqual(mockCode)
		})

		it('should handle errors', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const error = new Error('Failed to get code')
			vi.mocked(Ox.Provider.getCode).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getCode(address)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetCodeError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetCodeError',
				_tag: 'GetCodeError',
				cause: error,
			})
		})
	})

	describe('getStorageAt', () => {
		it('should get storage at successfully', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const slot = 0n
			const mockStorage = '0x0000000000000000000000000000000000000000000000000000000000000001'

			vi.mocked(Ox.Provider.getStorageAt).mockReturnValue(mockStorage)

			const result = await Effect.runPromise(Provider.getStorageAt(address, slot))

			expect(Ox.Provider.getStorageAt).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getStorageAt).toHaveBeenCalledWith(address, slot)
			expect(result).toEqual(mockStorage)
		})

		it('should handle errors', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const slot = 0n
			const error = new Error('Failed to get storage')
			vi.mocked(Ox.Provider.getStorageAt).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getStorageAt(address, slot)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetStorageAtError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetStorageAtError',
				_tag: 'GetStorageAtError',
				cause: error,
			})
		})
	})

	describe('getTransactionCount', () => {
		it('should get transaction count successfully', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const mockCount = 42

			vi.mocked(Ox.Provider.getTransactionCount).mockReturnValue(mockCount)

			const result = await Effect.runPromise(Provider.getTransactionCount(address))

			expect(Ox.Provider.getTransactionCount).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getTransactionCount).toHaveBeenCalledWith(address)
			expect(result).toEqual(mockCount)
		})

		it('should handle errors', async () => {
			const address = '0x1234567890123456789012345678901234567890'
			const error = new Error('Failed to get transaction count')
			vi.mocked(Ox.Provider.getTransactionCount).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getTransactionCount(address)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetTransactionCountError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetTransactionCountError',
				_tag: 'GetTransactionCountError',
				cause: error,
			})
		})
	})

	describe('getTransaction', () => {
		it('should get transaction successfully', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
			const mockTransaction = {
				hash,
				blockNumber: 12345n,
				from: '0x1234567890123456789012345678901234567890',
				to: '0x0987654321098765432109876543210987654321',
				value: 1000000000000000000n,
			}

			vi.mocked(Ox.Provider.getTransaction).mockReturnValue(mockTransaction)

			const result = await Effect.runPromise(Provider.getTransaction(hash))

			expect(Ox.Provider.getTransaction).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getTransaction).toHaveBeenCalledWith(hash)
			expect(result).toEqual(mockTransaction)
		})

		it('should return null for non-existent transaction', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'

			vi.mocked(Ox.Provider.getTransaction).mockReturnValue(null)

			const result = await Effect.runPromise(Provider.getTransaction(hash))

			expect(result).toBeNull()
		})

		it('should handle errors', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
			const error = new Error('Failed to get transaction')
			vi.mocked(Ox.Provider.getTransaction).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getTransaction(hash)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetTransactionError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetTransactionError',
				_tag: 'GetTransactionError',
				cause: error,
			})
		})
	})

	describe('getTransactionReceipt', () => {
		it('should get transaction receipt successfully', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
			const mockReceipt = {
				transactionHash: hash,
				blockNumber: 12345n,
				status: 1,
				gasUsed: 21000n,
			}

			vi.mocked(Ox.Provider.getTransactionReceipt).mockReturnValue(mockReceipt)

			const result = await Effect.runPromise(Provider.getTransactionReceipt(hash))

			expect(Ox.Provider.getTransactionReceipt).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getTransactionReceipt).toHaveBeenCalledWith(hash)
			expect(result).toEqual(mockReceipt)
		})

		it('should return null for non-existent receipt', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'

			vi.mocked(Ox.Provider.getTransactionReceipt).mockReturnValue(null)

			const result = await Effect.runPromise(Provider.getTransactionReceipt(hash))

			expect(result).toBeNull()
		})

		it('should handle errors', async () => {
			const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
			const error = new Error('Failed to get transaction receipt')
			vi.mocked(Ox.Provider.getTransactionReceipt).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getTransactionReceipt(hash)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetTransactionReceiptError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetTransactionReceiptError',
				_tag: 'GetTransactionReceiptError',
				cause: error,
			})
		})
	})

	describe('getLogs', () => {
		it('should get logs successfully', async () => {
			const filter = {
				fromBlock: 'latest',
				toBlock: 'latest',
				address: '0x1234567890123456789012345678901234567890',
			}
			const mockLogs = [
				{
					blockNumber: 12345n,
					address: '0x1234567890123456789012345678901234567890',
					topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
				},
			]

			vi.mocked(Ox.Provider.getLogs).mockReturnValue(mockLogs)

			const result = await Effect.runPromise(Provider.getLogs(filter))

			expect(Ox.Provider.getLogs).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getLogs).toHaveBeenCalledWith(filter)
			expect(result).toEqual(mockLogs)
		})

		it('should handle errors', async () => {
			const filter = {
				fromBlock: 'latest',
				toBlock: 'latest',
				address: '0x1234567890123456789012345678901234567890',
			}
			const error = new Error('Failed to get logs')
			vi.mocked(Ox.Provider.getLogs).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getLogs(filter)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetLogsError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetLogsError',
				_tag: 'GetLogsError',
				cause: error,
			})
		})
	})

	describe('estimateGas', () => {
		it('should estimate gas successfully', async () => {
			const transaction = {
				to: '0x1234567890123456789012345678901234567890',
				value: 0n,
			}
			const mockGas = 21000n

			vi.mocked(Ox.Provider.estimateGas).mockReturnValue(mockGas)

			const result = await Effect.runPromise(Provider.estimateGas(transaction))

			expect(Ox.Provider.estimateGas).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.estimateGas).toHaveBeenCalledWith(transaction)
			expect(result).toEqual(mockGas)
		})

		it('should handle errors', async () => {
			const transaction = {
				to: '0x1234567890123456789012345678901234567890',
				value: 0n,
			}
			const error = new Error('Failed to estimate gas')
			vi.mocked(Ox.Provider.estimateGas).mockImplementation(() => {
				throw error
			})

			const effect = Provider.estimateGas(transaction)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.EstimateGasError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'EstimateGasError',
				_tag: 'EstimateGasError',
				cause: error,
			})
		})
	})

	describe('getBlock', () => {
		it('should get block successfully', async () => {
			const blockNumber = 'latest'
			const mockBlock = {
				number: 12345n,
				hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				parentHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
			}

			vi.mocked(Ox.Provider.getBlock).mockReturnValue(mockBlock)

			const result = await Effect.runPromise(Provider.getBlock(blockNumber))

			expect(Ox.Provider.getBlock).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getBlock).toHaveBeenCalledWith(blockNumber)
			expect(result).toEqual(mockBlock)
		})

		it('should return null for non-existent block', async () => {
			const blockNumber = 99999n

			vi.mocked(Ox.Provider.getBlock).mockReturnValue(null)

			const result = await Effect.runPromise(Provider.getBlock(blockNumber))

			expect(result).toBeNull()
		})

		it('should handle errors', async () => {
			const blockNumber = 'latest'
			const error = new Error('Failed to get block')
			vi.mocked(Ox.Provider.getBlock).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getBlock(blockNumber)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetBlockError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetBlockError',
				_tag: 'GetBlockError',
				cause: error,
			})
		})
	})

	describe('getBlockWithTransactions', () => {
		it('should get block with transactions successfully', async () => {
			const blockNumber = 'latest'
			const mockBlock = {
				number: 12345n,
				hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				parentHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
				transactions: [
					{
						hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
						from: '0x1234567890123456789012345678901234567890',
						to: '0x0987654321098765432109876543210987654321',
					},
				],
			}

			vi.mocked(Ox.Provider.getBlockWithTransactions).mockReturnValue(mockBlock)

			const result = await Effect.runPromise(Provider.getBlockWithTransactions(blockNumber))

			expect(Ox.Provider.getBlockWithTransactions).toHaveBeenCalledTimes(1)
			expect(Ox.Provider.getBlockWithTransactions).toHaveBeenCalledWith(blockNumber)
			expect(result).toEqual(mockBlock)
		})

		it('should return null for non-existent block', async () => {
			const blockNumber = 99999n

			vi.mocked(Ox.Provider.getBlockWithTransactions).mockReturnValue(null)

			const result = await Effect.runPromise(Provider.getBlockWithTransactions(blockNumber))

			expect(result).toBeNull()
		})

		it('should handle errors', async () => {
			const blockNumber = 'latest'
			const error = new Error('Failed to get block with transactions')
			vi.mocked(Ox.Provider.getBlockWithTransactions).mockImplementation(() => {
				throw error
			})

			const effect = Provider.getBlockWithTransactions(blockNumber)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Provider.GetBlockWithTransactionsError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'GetBlockWithTransactionsError',
				_tag: 'GetBlockWithTransactionsError',
				cause: error,
			})
		})
	})
})
