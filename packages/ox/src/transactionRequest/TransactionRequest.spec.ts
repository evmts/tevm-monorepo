import { Effect } from 'effect'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import * as TransactionRequest from './TransactionRequest.js'
import Ox from 'ox'

vi.mock('ox', () => {
  return {
    default: {
      TransactionRequest: {
        assert: vi.fn(),
        isTransactionRequest: vi.fn(),
        validate: vi.fn()
      }
    }
  }
})

describe('TransactionRequest', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('assert', () => {
    it('should assert a valid transaction request successfully', async () => {
      vi.mocked(Ox.TransactionRequest.assert).mockImplementation(() => {})

      const validRequest = {
        to: '0x1234567890123456789012345678901234567890',
        value: 1000000000000000000n,
        gas: 21000n,
      }

      await Effect.runPromise(TransactionRequest.assert(validRequest))
      
      expect(Ox.TransactionRequest.assert).toHaveBeenCalledTimes(1)
      expect(Ox.TransactionRequest.assert).toHaveBeenCalledWith(validRequest)
    })

    it('should handle errors', async () => {
      const error = new Error('Invalid transaction request')
      vi.mocked(Ox.TransactionRequest.assert).mockImplementation(() => {
        throw error
      })

      const invalidRequest = {
        to: 'invalid address',
        value: 'not a number',
      }

      const effect = TransactionRequest.assert(invalidRequest)
      
      await expect(Effect.runPromise(effect)).rejects.toThrow(TransactionRequest.AssertError)
      await expect(Effect.runPromise(effect)).rejects.toMatchObject({
        name: 'AssertError',
        _tag: 'AssertError',
        cause: error
      })
    })
  })

  describe('isTransactionRequest', () => {
    it('should check if a value is a transaction request', () => {
      vi.mocked(Ox.TransactionRequest.isTransactionRequest).mockReturnValue(true)

      const validRequest = {
        to: '0x1234567890123456789012345678901234567890',
        value: 1000000000000000000n,
        gas: 21000n,
      }

      const result = TransactionRequest.isTransactionRequest(validRequest)
      
      expect(Ox.TransactionRequest.isTransactionRequest).toHaveBeenCalledTimes(1)
      expect(Ox.TransactionRequest.isTransactionRequest).toHaveBeenCalledWith(validRequest)
      expect(result).toBe(true)
    })

    it('should return false for invalid transaction requests', () => {
      vi.mocked(Ox.TransactionRequest.isTransactionRequest).mockReturnValue(false)

      const invalidRequest = {
        to: 'invalid address',
        value: 'not a number',
      }

      const result = TransactionRequest.isTransactionRequest(invalidRequest)
      
      expect(result).toBe(false)
    })
  })

  describe('validate', () => {
    it('should validate a transaction request', () => {
      vi.mocked(Ox.TransactionRequest.validate).mockReturnValue(true)

      const validRequest = {
        to: '0x1234567890123456789012345678901234567890',
        value: 1000000000000000000n,
        gas: 21000n,
      }

      const result = TransactionRequest.validate(validRequest)
      
      expect(Ox.TransactionRequest.validate).toHaveBeenCalledTimes(1)
      expect(Ox.TransactionRequest.validate).toHaveBeenCalledWith(validRequest)
      expect(result).toBe(true)
    })

    it('should return false for invalid transaction requests', () => {
      vi.mocked(Ox.TransactionRequest.validate).mockReturnValue(false)

      const invalidRequest = {
        to: 'invalid address',
        value: 'not a number',
      }

      const result = TransactionRequest.validate(invalidRequest)
      
      expect(result).toBe(false)
    })
  })
})