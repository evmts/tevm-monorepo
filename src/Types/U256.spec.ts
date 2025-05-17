import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { Schema } from 'effect'
import {
  U256,
  U256FromBytes,
  U256FromHex,
  U256FromString,
  U256FromWei,
  U256FromKwei,
  U256FromMwei,
  U256FromGwei,
  U256FromSzabo,
  U256FromFinney,
  U256FromEther,
  U256ToWei,
  U256ToKwei,
  U256ToMwei,
  U256ToGwei,
  U256ToSzabo,
  U256ToFinney,
  U256ToEther,
  U256ToHex,
  U256ToBytes,
  maxU256,
} from './U256.js'

describe('U256', () => {
  describe('basic U256 operations', () => {
    it('should decode a number into U256', () => {
      const value = Schema.decodeUnknownSync(U256)(123n)
      expect(value).toBe(123n)
    })

    it('should fail to decode a number larger than maxU256', () => {
      expect(() => Schema.decodeUnknownSync(U256)(maxU256 + 1n)).toThrow()
    })

    it('should fail to decode a negative number', () => {
      expect(() => Schema.decodeUnknownSync(U256)(-1n)).toThrow()
    })
  })

  describe('U256FromBytes', () => {
    it('should decode bytes into U256', () => {
      // 66051n = 0x0000000000000000000000000000000000000000000000000000000000010203n
      const bytes = new Uint8Array(32)
      bytes[29] = 1
      bytes[30] = 2
      bytes[31] = 3
      const value = Schema.decodeUnknownSync(U256FromBytes)(bytes)
      expect(value).toBe(66051n) // 1 * 256^2 + 2 * 256 + 3
    })
  })

  describe('U256FromHex', () => {
    it('should decode hex string into U256', () => {
      const value = Schema.decodeUnknownSync(U256FromHex)('0x123')
      expect(value).toBe(291n)
    })
  })

  describe('U256FromString', () => {
    it('should decode string into U256', () => {
      const value = Schema.decodeUnknownSync(U256FromString)('123')
      expect(value).toBe(123n)
    })
  })

  describe('unit conversions', () => {
    const testCases = [
      { unit: 'wei', value: '1000000000000000000', expected: 1000000000000000000n },
      { unit: 'kwei', value: '1000000000000000', expected: 1000000000000000000n },
      { unit: 'mwei', value: '1000000000000', expected: 1000000000000000000n },
      { unit: 'gwei', value: '1000000000', expected: 1000000000000000000n },
      { unit: 'szabo', value: '1000000', expected: 1000000000000000000n },
      { unit: 'finney', value: '1000', expected: 1000000000000000000n },
      { unit: 'ether', value: '1', expected: 1000000000000000000n },
    ] as const

    testCases.forEach(({ unit, value, expected }) => {
      describe(`${unit} conversions`, () => {
        const fromUnit = {
          wei: U256FromWei,
          kwei: U256FromKwei,
          mwei: U256FromMwei,
          gwei: U256FromGwei,
          szabo: U256FromSzabo,
          finney: U256FromFinney,
          ether: U256FromEther,
        }[unit]!

        const toUnit = {
          wei: U256ToWei,
          kwei: U256ToKwei,
          mwei: U256ToMwei,
          gwei: U256ToGwei,
          szabo: U256ToSzabo,
          finney: U256ToFinney,
          ether: U256ToEther,
        }[unit]!

        it(`should decode ${unit} string into U256`, () => {
          const result = Schema.decodeUnknownSync(fromUnit)(value)
          expect(result.toString()).toBe(expected.toString())
        })

        it(`should encode U256 into ${unit} string`, () => {
          const result = Effect.runSync(toUnit(expected as any))
          expect(result).toBe(value)
        })
      })
    })
  })

  describe('hex conversions', () => {
    it('should convert U256 to hex string', () => {
      const value = 255n as any
      const result = Effect.runSync(U256ToHex(value))
      expect(result).toBe('0xff')
    })
  })

  describe('bytes conversions', () => {
    it('should convert U256 to bytes', () => {
      const value = 66051n as any // 1 * 256^2 + 2 * 256 + 3
      const result = Effect.runSync(U256ToBytes(value))
      const expected = new Uint8Array(32)
      expected[29] = 1
      expected[30] = 2
      expected[31] = 3
      expect(result).toEqual(expected)
    })
  })

  describe('edge cases', () => {
    it('should handle zero values', () => {
      const value = 0n as any
      expect(Effect.runSync(U256ToWei(value))).toBe('0')
      expect(Effect.runSync(U256ToEther(value))).toBe('0')
    })

    it('should handle maxU256', () => {
      const value = maxU256 as any
      expect(() => Effect.runSync(U256ToWei(value))).not.toThrow()
      expect(() => Effect.runSync(U256ToEther(value))).not.toThrow()
    })
  })
})