import { describe, expect, it } from 'vitest'
import '../index.js' // Import to extend expect with our matchers

describe('toBeHex', () => {
  const validHexStrings = [
    '0x1234abcd',
    '0x',
    '0x00',
    '0xFFFFFFFF',
    '0xabcdef123456789',
    '0xABCDEF123456789',
    '0x0',
    '0xf',
    '0xF',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // 64 chars (32 bytes)
  ]

  const validHexStringsWithLength = [
    { hex: '0x1234', length: 2 }, // 2 bytes
    { hex: '0xabcd', length: 2 }, // 2 bytes
    { hex: '0xABCD', length: 2 }, // 2 bytes
    { hex: '0x00', length: 1 }, // 1 byte
    { hex: '0x', length: 0 }, // 0 bytes
    { hex: '0x123456789abcdef0', length: 8 }, // 8 bytes
    { hex: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', length: 32 }, // 32 bytes (tx hash)
  ]

  const invalidHexStrings = [
    // Missing 0x prefix
    '1234',
    'abcdef',
    'FFFFFF',
    'ghij',
    'x1234',
    '0X1234', // wrong case for X
  ]

  const invalidHexStringsStart0x = [
    // Invalid hex characters
    '0xghij',
    '0x123G',
    '0xZZZZ',
    '0x123!',
    '0x@#$%',
    '0xhello',

    // Invalid format
    '0x 1234', // space
    '0x12 34', // space in middle
  ]

  const nonStringTypes = [
    123,
    null,
    undefined,
    {},
    [],
    BigInt(123),
    true,
    Symbol('test'),
  ]

  const invalidLengthCases = [
    { hex: '0x123', expectedLength: 2 }, // odd number of chars after 0x
    { hex: '0x12345', expectedLength: 2 }, // too long
    { hex: '0x1234', expectedLength: 1 }, // expecting 1 byte but got 2
    { hex: '0x1234', expectedLength: 4 }, // expecting 4 bytes but got 2
    { hex: '0x', expectedLength: 1 }, // expecting 1 byte but got 0
  ]

  describe('default behavior (strict: true)', () => {
    it('should pass for valid hex strings', () => {
      validHexStrings.forEach(hex => {
        expect(hex).toBeHex()
        expect(hex).toBeHex({ strict: true })
      })
    })

    it('should fail for invalid hex strings or non-string types', () => {
      [...invalidHexStrings, ...invalidHexStringsStart0x, ...nonStringTypes].forEach(hex => {
        expect(() => expect(hex).toBeHex()).toThrow()
        expect(() => expect(hex).toBeHex({ strict: true })).toThrow()
      })
    })
  })

  describe('non-strict mode (strict: false)', () => {
    it('should pass for valid hex strings when strict: false', () => {
      [...validHexStrings, ...invalidHexStringsStart0x].forEach(hex => {
        expect(hex).toBeHex({ strict: false })
      })
    })

    it('should still fail for completely invalid format when strict: false', () => {
      [...invalidHexStrings, ...nonStringTypes].forEach(hex => {
        expect(() => expect(hex).toBeHex({ strict: false })).toThrow()
      })
    })
  })

  describe('length validation', () => {
    it('should pass for hex strings with correct length', () => {
      validHexStringsWithLength.forEach(({ hex, length }) => {
        expect(hex).toBeHex({ length })
        expect(hex).toBeHex({ length, strict: true })
        expect(hex).toBeHex({ length, strict: false })
      })
    })

    it('should fail for hex strings with incorrect length', () => {
      invalidLengthCases.forEach(({ hex, expectedLength }) => {
        expect(() => expect(hex).toBeHex({ length: expectedLength })).toThrow()
        expect(() => expect(hex).toBeHex({ length: expectedLength, strict: true })).toThrow()
        expect(() => expect(hex).toBeHex({ length: expectedLength, strict: false })).toThrow()
      })
    })

    it('should fail for invalid hex even with correct length specification', () => {
      expect(() => expect('0xGHIJ').toBeHex({ length: 2 })).toThrow()
      expect(() => expect('1234').toBeHex({ length: 2 })).toThrow() // missing 0x
      expect(() => expect('0x123!').toBeHex({ length: 2 })).toThrow() // invalid char
    })
  })

  describe('combined options', () => {
    it('should work with both strict and length options', () => {
      expect('0x1234').toBeHex({ strict: true, length: 2 })
      expect('0x1234').toBeHex({ strict: false, length: 2 })

      expect(() => expect('0x123G').toBeHex({ strict: true, length: 2 })).toThrow()
      expect(() => expect('0x123G').toBeHex({ strict: false, length: 3 })).toThrow()
      expect('0x123G').toBeHex({ strict: false, length: 2 })
    })
  })

  describe('.not modifier', () => {
    it('should work with .not for invalid hex strings', () => {
      [...invalidHexStrings, ...nonStringTypes].forEach(hex => {
        expect(hex).not.toBeHex()
      })
    })

    it('should work with .not for length mismatches', () => {
      invalidLengthCases.forEach(({ hex, expectedLength }) => {
        expect(hex).not.toBeHex({ length: expectedLength })
      })
    })

    it('should fail with .not for valid hex strings', () => {
      validHexStrings.forEach(hex => {
        expect(() => expect(hex).not.toBeHex()).toThrow()
      })
    })

    it('should fail with .not for valid hex strings with correct length', () => {
      validHexStringsWithLength.forEach(({ hex, length }) => {
        expect(() => expect(hex).not.toBeHex({ length })).toThrow()
      })
    })
  })

  describe('error messages', () => {
    it('should provide helpful error messages for missing 0x prefix', () => {
      try {
        expect('1234').toBeHex()
      } catch (error) {
        expect(error.message).toContain('Expected "1234" to start with "0x"')
      }
    })

    it('should provide helpful error messages for invalid hex characters', () => {
      try {
        expect('0xghij').toBeHex()
      } catch (error) {
        expect(error.message).toContain('contain only hex characters')
      }
    })

    it('should provide helpful error messages for wrong length', () => {
      try {
        expect('0x123').toBeHex({ length: 2 })
      } catch (error) {
        expect(error.message).toContain('Expected "0x123" to have 2 hex characters after "0x", but got')
      }
    })

    it('should provide different messages for different error types', () => {
      const testCases = [
        { input: 'hello', expectedMessage: 'start with "0x"' },
        { input: '0xGHIJ', expectedMessage: 'contain only hex characters' },
        { input: '0x123', options: { length: 2 }, expectedMessage: 'have 2 hex characters' },
      ]

      testCases.forEach(({ input, options, expectedMessage }) => {
        try {
          expect(input).toBeHex(options)
        } catch (error) {
          expect(error.message).toContain(expectedMessage)
        }
      })
    })
  })

  describe('real-world usage patterns', () => {
    it('should validate transaction hashes (32 bytes)', () => {
      const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      expect(txHash).toBeHex({ length: 32 })
    })

    it('should validate block hashes (32 bytes)', () => {
      const blockHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      expect(blockHash).toBeHex({ length: 32 })
    })

    it('should validate addresses as hex (20 bytes)', () => {
      const address = '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'
      expect(address).toBeHex({ length: 20 })
    })

    it('should validate short identifiers', () => {
      expect('0x1234').toBeHex({ length: 2 })
      expect('0xabcd').toBeHex({ length: 2 })
    })

    it('should validate function selectors (4 bytes)', () => {
      expect('0xa9059cbb').toBeHex({ length: 4 }) // transfer function selector
      expect('0x095ea7b3').toBeHex({ length: 4 }) // approve function selector
    })

    it('should validate empty hex', () => {
      expect('0x').toBeHex({ length: 0 })
      expect('0x').toBeHex() // should pass without length requirement
    })
  })
})