import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { EnsEffectLive, EnsEffectService } from './EnsEffect.js'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

const mockGetAddress = vi.fn()
const mockGetName = vi.fn()
const mockGetAvatar = vi.fn()
const mockGetText = vi.fn()
const mockGetUniversalResolver = vi.fn()
const mockNormalize = vi.fn()

// Mock the Ox ENS module
vi.mock('ox/Ens', () => ({
  getAddress: (...args: any[]) => mockGetAddress(...args),
  getName: (...args: any[]) => mockGetName(...args),
  getAvatar: (...args: any[]) => mockGetAvatar(...args),
  getText: (...args: any[]) => mockGetText(...args),
  getUniversalResolver: (...args: any[]) => mockGetUniversalResolver(...args),
  normalize: (...args: any[]) => mockNormalize(...args),
}))

describe('EnsEffect', () => {
  const ens: EnsEffectService = EnsEffectLive

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAddressEffect', () => {
    it('should return the address for a valid ENS name', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      mockGetAddress.mockResolvedValue(mockAddress)

      const result = await Effect.runPromise(
        ens.getAddressEffect({
          name: 'test.eth',
          provider: {} as any,
        })
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
          ens.getAddressEffect({
            name: 'nonexistent.eth',
            provider: {} as any,
          })
        )
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('ENS name not found')
        expect(err).toBe(error)
      }
    })
  })

  describe('getNameEffect', () => {
    it('should return the ENS name for a valid address', async () => {
      const mockName = 'test.eth'
      mockGetName.mockResolvedValue(mockName)

      const result = await Effect.runPromise(
        ens.getNameEffect({
          address: '0x1234567890123456789012345678901234567890',
          provider: {} as any,
        })
      )

      expect(result).toBe(mockName)
      expect(mockGetName).toHaveBeenCalledWith({
        address: '0x1234567890123456789012345678901234567890',
        provider: expect.anything(),
      })
    })
  })

  describe('getAvatarEffect', () => {
    it('should return the avatar for a valid ENS name', async () => {
      const mockAvatar = 'https://example.com/avatar.png'
      mockGetAvatar.mockResolvedValue(mockAvatar)

      const result = await Effect.runPromise(
        ens.getAvatarEffect({
          name: 'test.eth',
          provider: {} as any,
        })
      )

      expect(result).toBe(mockAvatar)
      expect(mockGetAvatar).toHaveBeenCalledWith({
        name: 'test.eth',
        provider: expect.anything(),
      })
    })
  })

  describe('getTextEffect', () => {
    it('should return the text record for a valid ENS name', async () => {
      const mockText = 'Hello, ENS!'
      mockGetText.mockResolvedValue(mockText)

      const result = await Effect.runPromise(
        ens.getTextEffect({
          name: 'test.eth',
          key: 'description',
          provider: {} as any,
        })
      )

      expect(result).toBe(mockText)
      expect(mockGetText).toHaveBeenCalledWith({
        name: 'test.eth',
        key: 'description',
        provider: expect.anything(),
      })
    })
  })

  describe('getUniversalResolverEffect', () => {
    it('should return the universal resolver', async () => {
      const mockResolver = { address: '0x1234567890123456789012345678901234567890' }
      mockGetUniversalResolver.mockResolvedValue(mockResolver)

      const result = await Effect.runPromise(
        ens.getUniversalResolverEffect({
          provider: {} as any,
        })
      )

      expect(result).toEqual(mockResolver)
      expect(mockGetUniversalResolver).toHaveBeenCalledWith({
        provider: expect.anything(),
      })
    })
  })

  describe('normalizeEffect', () => {
    it('should return the normalized name', async () => {
      const mockNormalizedName = 'test.eth'
      mockNormalize.mockReturnValue(mockNormalizedName)

      const result = await Effect.runPromise(
        ens.normalizeEffect({
          name: 'TEST.eth',
        })
      )

      expect(result).toBe(mockNormalizedName)
      expect(mockNormalize).toHaveBeenCalledWith({
        name: 'TEST.eth',
      })
    })
  })
})