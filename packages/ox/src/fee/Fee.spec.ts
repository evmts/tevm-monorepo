import { Effect } from 'effect'
import * as OxFee from 'ox/execution/fee'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Fee from './Fee.js'

// Mock the OxFee module
vi.mock('ox/execution/fee', () => {
  return {
    calculateNextBaseFee: vi.fn(),
    calculatePriorityFee: vi.fn(),
    createFeeHistory: vi.fn(),
    formatFeeHistory: vi.fn(),
    parseFeeHistory: vi.fn(),
  }
})

describe('Fee', () => {
  const mockCalculateNextBaseFee = OxFee.calculateNextBaseFee as vi.Mock
  const mockCalculatePriorityFee = OxFee.calculatePriorityFee as vi.Mock
  const mockCreateFeeHistory = OxFee.createFeeHistory as vi.Mock
  const mockFormatFeeHistory = OxFee.formatFeeHistory as vi.Mock
  const mockParseFeeHistory = OxFee.parseFeeHistory as vi.Mock

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('calculateNextBaseFee', () => {
    it('should calculate the base fee for the next block', async () => {
      const params = {
        parentBaseFeePerGas: 1000000000n,
        parentGasUsed: 15000000n,
        parentGasLimit: 30000000n,
      }
      const expectedBaseFee = 1031250000n

      mockCalculateNextBaseFee.mockReturnValue(expectedBaseFee)

      const result = await Effect.runPromise(Fee.calculateNextBaseFee(params))

      expect(result).toBe(expectedBaseFee)
      expect(mockCalculateNextBaseFee).toHaveBeenCalledWith(params)
    })

    it('should handle errors', async () => {
      const params = {
        parentBaseFeePerGas: 1000000000n,
        parentGasUsed: 15000000n,
        parentGasLimit: 30000000n,
      }
      const error = new Error('Base fee calculation error')

      mockCalculateNextBaseFee.mockImplementation(() => {
        throw error
      })

      const program = Fee.calculateNextBaseFee(params)
      
      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Fee.CalculateNextBaseFeeError)
      await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
    })
  })

  describe('calculatePriorityFee', () => {
    it('should calculate the EIP-1559 priority fee', async () => {
      const params = {
        baseFeePerGas: 1000000000n,
        maxFeePerGas: 2000000000n,
      }
      const expectedPriorityFee = 1000000000n

      mockCalculatePriorityFee.mockReturnValue(expectedPriorityFee)

      const result = await Effect.runPromise(Fee.calculatePriorityFee(params))

      expect(result).toBe(expectedPriorityFee)
      expect(mockCalculatePriorityFee).toHaveBeenCalledWith(params)
    })

    it('should handle errors', async () => {
      const params = {
        baseFeePerGas: 1000000000n,
        maxFeePerGas: 2000000000n,
      }
      const error = new Error('Priority fee calculation error')

      mockCalculatePriorityFee.mockImplementation(() => {
        throw error
      })

      const program = Fee.calculatePriorityFee(params)
      
      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Fee.CalculatePriorityFeeError)
      await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
    })
  })

  describe('createFeeHistory', () => {
    it('should create an EIP-1559 fee history from blocks', async () => {
      const params = {
        blocks: [
          { baseFeePerGas: 1000000000n, gasUsed: 15000000n, gasLimit: 30000000n },
          { baseFeePerGas: 1031250000n, gasUsed: 16000000n, gasLimit: 30000000n },
        ],
        percentiles: [25, 50, 75],
      }
      const expectedFeeHistory = {
        baseFeePerGas: [1000000000n, 1031250000n],
        gasUsedRatio: [0.5, 0.533],
        oldestBlock: 0n,
        reward: [[250000000n, 500000000n, 750000000n], [260000000n, 515000000n, 775000000n]],
      }

      mockCreateFeeHistory.mockReturnValue(expectedFeeHistory)

      const result = await Effect.runPromise(Fee.createFeeHistory(params))

      expect(result).toEqual(expectedFeeHistory)
      expect(mockCreateFeeHistory).toHaveBeenCalledWith(params)
    })

    it('should handle errors', async () => {
      const params = {
        blocks: [],
        percentiles: [25, 50, 75],
      }
      const error = new Error('Fee history creation error')

      mockCreateFeeHistory.mockImplementation(() => {
        throw error
      })

      const program = Fee.createFeeHistory(params)
      
      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Fee.CreateFeeHistoryError)
      await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
    })
  })

  describe('formatFeeHistory', () => {
    it('should format a fee history to JSON', async () => {
      const feeHistory = {
        baseFeePerGas: [1000000000n, 1031250000n],
        gasUsedRatio: [0.5, 0.533],
        oldestBlock: 0n,
        reward: [[250000000n, 500000000n, 750000000n], [260000000n, 515000000n, 775000000n]],
      }
      const expectedFeeHistoryJson = {
        baseFeePerGas: ['0x3b9aca00', '0x3d6c6cfc'],
        gasUsedRatio: [0.5, 0.533],
        oldestBlock: '0x0',
        reward: [['0xee6b280', '0x1dcd6500', '0x2cb41780'], ['0xf7ac000', '0x1eb1c200', '0x2e52c400']],
      }

      mockFormatFeeHistory.mockReturnValue(expectedFeeHistoryJson)

      const result = await Effect.runPromise(Fee.formatFeeHistory(feeHistory))

      expect(result).toEqual(expectedFeeHistoryJson)
      expect(mockFormatFeeHistory).toHaveBeenCalledWith(feeHistory)
    })

    it('should handle errors', async () => {
      const feeHistory = {
        baseFeePerGas: [],
        gasUsedRatio: [],
        oldestBlock: 0n,
        reward: [],
      }
      const error = new Error('Fee history formatting error')

      mockFormatFeeHistory.mockImplementation(() => {
        throw error
      })

      const program = Fee.formatFeeHistory(feeHistory)
      
      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Fee.FormatFeeHistoryError)
      await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
    })
  })

  describe('parseFeeHistory', () => {
    it('should parse a fee history from JSON', async () => {
      const feeHistoryJson = {
        baseFeePerGas: ['0x3b9aca00', '0x3d6c6cfc'],
        gasUsedRatio: [0.5, 0.533],
        oldestBlock: '0x0',
        reward: [['0xee6b280', '0x1dcd6500', '0x2cb41780'], ['0xf7ac000', '0x1eb1c200', '0x2e52c400']],
      }
      const expectedFeeHistory = {
        baseFeePerGas: [1000000000n, 1031250000n],
        gasUsedRatio: [0.5, 0.533],
        oldestBlock: 0n,
        reward: [[250000000n, 500000000n, 750000000n], [260000000n, 515000000n, 775000000n]],
      }

      mockParseFeeHistory.mockReturnValue(expectedFeeHistory)

      const result = await Effect.runPromise(Fee.parseFeeHistory(feeHistoryJson))

      expect(result).toEqual(expectedFeeHistory)
      expect(mockParseFeeHistory).toHaveBeenCalledWith(feeHistoryJson)
    })

    it('should handle errors', async () => {
      const feeHistoryJson = {
        baseFeePerGas: ['invalid'],
        gasUsedRatio: [0.5],
        oldestBlock: '0x0',
        reward: [],
      }
      const error = new Error('Fee history parsing error')

      mockParseFeeHistory.mockImplementation(() => {
        throw error
      })

      const program = Fee.parseFeeHistory(feeHistoryJson)
      
      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Fee.ParseFeeHistoryError)
      await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
    })
  })
})