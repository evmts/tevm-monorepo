import { Effect } from 'effect'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import * as Withdrawal from './Withdrawal.js'
import Ox from 'ox'

vi.mock('ox', () => {
  return {
    default: {
      Withdrawal: {
        assert: vi.fn(),
        isWithdrawal: vi.fn(),
        validate: vi.fn()
      }
    }
  }
})

describe('Withdrawal', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('assert', () => {
    it('should assert a valid withdrawal successfully', async () => {
      vi.mocked(Ox.Withdrawal.assert).mockImplementation(() => {})

      const validWithdrawal = {
        index: 1n,
        validatorIndex: 123n,
        address: '0x1234567890123456789012345678901234567890',
        amount: 1000000000000000000n,
      }

      await Effect.runPromise(Withdrawal.assert(validWithdrawal))
      
      expect(Ox.Withdrawal.assert).toHaveBeenCalledTimes(1)
      expect(Ox.Withdrawal.assert).toHaveBeenCalledWith(validWithdrawal)
    })

    it('should handle errors', async () => {
      const error = new Error('Invalid withdrawal')
      vi.mocked(Ox.Withdrawal.assert).mockImplementation(() => {
        throw error
      })

      const invalidWithdrawal = {
        index: 'not a bigint',
        address: 'invalid address',
      }

      const effect = Withdrawal.assert(invalidWithdrawal)
      
      await expect(Effect.runPromise(effect)).rejects.toThrow(Withdrawal.AssertError)
      await expect(Effect.runPromise(effect)).rejects.toMatchObject({
        name: 'AssertError',
        _tag: 'AssertError',
        cause: error
      })
    })
  })

  describe('isWithdrawal', () => {
    it('should check if a value is a withdrawal', () => {
      vi.mocked(Ox.Withdrawal.isWithdrawal).mockReturnValue(true)

      const validWithdrawal = {
        index: 1n,
        validatorIndex: 123n,
        address: '0x1234567890123456789012345678901234567890',
        amount: 1000000000000000000n,
      }

      const result = Withdrawal.isWithdrawal(validWithdrawal)
      
      expect(Ox.Withdrawal.isWithdrawal).toHaveBeenCalledTimes(1)
      expect(Ox.Withdrawal.isWithdrawal).toHaveBeenCalledWith(validWithdrawal)
      expect(result).toBe(true)
    })

    it('should return false for invalid withdrawals', () => {
      vi.mocked(Ox.Withdrawal.isWithdrawal).mockReturnValue(false)

      const invalidWithdrawal = {
        index: 'not a bigint',
        address: 'invalid address',
      }

      const result = Withdrawal.isWithdrawal(invalidWithdrawal)
      
      expect(result).toBe(false)
    })
  })

  describe('validate', () => {
    it('should validate a withdrawal', () => {
      vi.mocked(Ox.Withdrawal.validate).mockReturnValue(true)

      const validWithdrawal = {
        index: 1n,
        validatorIndex: 123n,
        address: '0x1234567890123456789012345678901234567890',
        amount: 1000000000000000000n,
      }

      const result = Withdrawal.validate(validWithdrawal)
      
      expect(Ox.Withdrawal.validate).toHaveBeenCalledTimes(1)
      expect(Ox.Withdrawal.validate).toHaveBeenCalledWith(validWithdrawal)
      expect(result).toBe(true)
    })

    it('should return false for invalid withdrawals', () => {
      vi.mocked(Ox.Withdrawal.validate).mockReturnValue(false)

      const invalidWithdrawal = {
        index: 'not a bigint',
        address: 'invalid address',
      }

      const result = Withdrawal.validate(invalidWithdrawal)
      
      expect(result).toBe(false)
    })
  })
})