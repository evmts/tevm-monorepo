import { Effect } from 'effect'
import Ox from 'ox'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as ENS from './ENS.js'

// Mock the Ox ENS module
const mockGetAddress = vi.fn()
const mockGetName = vi.fn()
const mockGetAvatar = vi.fn()
const mockGetText = vi.fn()
const mockGetUniversalResolver = vi.fn()
const mockNormalize = vi.fn()
const mockLabelhash = vi.fn()
const mockNamehash = vi.fn()

vi.mock('ox', () => {
  return {
    default: {
      Ens: {
        getAddress: (...args: any[]) => mockGetAddress(...args),
        getName: (...args: any[]) => mockGetName(...args),
        getAvatar: (...args: any[]) => mockGetAvatar(...args),
        getText: (...args: any[]) => mockGetText(...args),
        getUniversalResolver: (...args: any[]) => mockGetUniversalResolver(...args),
        normalize: (...args: any[]) => mockNormalize(...args),
        labelhash: (...args: any[]) => mockLabelhash(...args),
        namehash: (...args: any[]) => mockNamehash(...args),
      }
    }
  }
})

describe('ENS', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAddress', () => {
    it('should return the address for a valid ENS name', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      mockGetAddress.mockResolvedValue(mockAddress)

      const result = await Effect.runPromise(
        ENS.getAddress({
          name: 'test.eth',
          provider: {} as any,
        }),
      )

      expect(result).toBe(mockAddress)
      expect(mockGetAddress).toHaveBeenCalledWith({
        name: 'test.eth',
        provider: expect.anything(),
      })
    })

    it('should handle errors properly', async () => {
      const error = new Error('ENS name not found')
      mockGetAddress.mockRejectedValue(error)

      try {
        await Effect.runPromise(
          ENS.getAddress({
            name: 'nonexistent.eth',
            provider: {} as any,
          }),
        )
        expect.fail('Should have thrown an error')
      } catch (err) {
        expect(err).toBeInstanceOf(ENS.GetAddressError)
        expect(err.cause).toBe(error)
      }
    })
  })

  describe('getName', () => {
    it('should return the ENS name for a valid address', async () => {
      const mockName = 'test.eth'
      mockGetName.mockResolvedValue(mockName)

      const result = await Effect.runPromise(
        ENS.getName({
          address: '0x1234567890123456789012345678901234567890',
          provider: {} as any,
        }),
      )

      expect(result).toBe(mockName)
      expect(mockGetName).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        provider: expect.anything(),
      })
    })
  })

  describe('normalize', () => {
    it('should return the normalized name', async () => {
      const mockNormalizedName = 'test.eth'
      mockNormalize.mockReturnValue(mockNormalizedName)

      const result = await Effect.runPromise(
        ENS.normalize({
          name: 'TEST.eth',
        }),
      )

      expect(result).toBe(mockNormalizedName)
      expect(mockNormalize).toHaveBeenCalledWith({
        name: 'TEST.eth',
      })
    })
  })

  describe('labelhash', () => {
    it('should generate the correct labelhash', async () => {
      const mockLabelhashResult = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      mockLabelhash.mockReturnValue(mockLabelhashResult)

      const result = await Effect.runPromise(ENS.labelhash('test'))

      expect(result).toBe(mockLabelhashResult)
      expect(mockLabelhash).toHaveBeenCalledWith('test')
    })
  })

  describe('namehash', () => {
    it('should generate the correct namehash', async () => {
      const mockNamehashResult = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      mockNamehash.mockReturnValue(mockNamehashResult)

      const result = await Effect.runPromise(ENS.namehash('test.eth'))

      expect(result).toBe(mockNamehashResult)
      expect(mockNamehash).toHaveBeenCalledWith('test.eth')
    })
  })
})