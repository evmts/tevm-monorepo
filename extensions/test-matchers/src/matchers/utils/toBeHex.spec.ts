import { describe, expect, it } from 'vitest'

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

	const validHexStringsWithSize = [
		{ hex: '0x1234', size: 2 }, // 2 bytes
		{ hex: '0xabcd', size: 2 }, // 2 bytes
		{ hex: '0xABCD', size: 2 }, // 2 bytes
		{ hex: '0x00', size: 1 }, // 1 byte
		{ hex: '0x', size: 0 }, // 0 bytes
		{ hex: '0x123456789abcdef0', size: 8 }, // 8 bytes
		{ hex: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', size: 32 }, // 32 bytes (tx hash)
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

	const nonStringTypes = [123, null, undefined, {}, [], BigInt(123), true, Symbol('test')]

	const invalidSizeCases = [
		{ hex: '0x123', expectedSize: 2 }, // odd number of chars after 0x
		{ hex: '0x12345', expectedSize: 2 }, // too long
		{ hex: '0x1234', expectedSize: 1 }, // expecting 1 byte but got 2
		{ hex: '0x1234', expectedSize: 4 }, // expecting 4 bytes but got 2
		{ hex: '0x', expectedSize: 1 }, // expecting 1 byte but got 0
	]

	describe('default behavior (strict: true)', () => {
		it('should pass for valid hex strings', () => {
			validHexStrings.forEach((hex) => {
				expect(hex).toBeHex()
				expect(hex).toBeHex({ strict: true })
			})
		})

		it('should fail for invalid hex strings or non-string types', () => {
			;[...invalidHexStrings, ...invalidHexStringsStart0x, ...nonStringTypes].forEach((hex) => {
				expect(() => expect(hex).toBeHex()).toThrow()
				expect(() => expect(hex).toBeHex({ strict: true })).toThrow()
			})
		})
	})

	describe('non-strict mode (strict: false)', () => {
		it('should pass for valid hex strings when strict: false', () => {
			;[...validHexStrings, ...invalidHexStringsStart0x].forEach((hex) => {
				expect(hex).toBeHex({ strict: false })
			})
		})

		it('should still fail for completely invalid format when strict: false', () => {
			;[...invalidHexStrings, ...nonStringTypes].forEach((hex) => {
				expect(() => expect(hex).toBeHex({ strict: false })).toThrow()
			})
		})
	})

	describe('size validation', () => {
		it('should pass for hex strings with correct size', () => {
			validHexStringsWithSize.forEach(({ hex, size }) => {
				expect(hex).toBeHex({ size })
				expect(hex).toBeHex({ size, strict: true })
				expect(hex).toBeHex({ size, strict: false })
			})
		})

		it('should fail for hex strings with incorrect size', () => {
			invalidSizeCases.forEach(({ hex, expectedSize }) => {
				expect(() => expect(hex).toBeHex({ size: expectedSize })).toThrow()
				expect(() => expect(hex).toBeHex({ size: expectedSize, strict: true })).toThrow()
				expect(() => expect(hex).toBeHex({ size: expectedSize, strict: false })).toThrow()
			})
		})

		it('should fail for invalid hex even with correct size specification', () => {
			expect(() => expect('0xGHIJ').toBeHex({ size: 2 })).toThrow()
			expect(() => expect('1234').toBeHex({ size: 2 })).toThrow() // missing 0x
			expect(() => expect('0x123!').toBeHex({ size: 2 })).toThrow() // invalid char
		})
	})

	describe('combined options', () => {
		it('should work with both strict and size options', () => {
			expect('0x1234').toBeHex({ strict: true, size: 2 })
			expect('0x1234').toBeHex({ strict: false, size: 2 })

			expect(() => expect('0x123G').toBeHex({ strict: true, size: 2 })).toThrow()
			expect(() => expect('0x123G').toBeHex({ strict: false, size: 3 })).toThrow()
			expect('0x123G').toBeHex({ strict: false, size: 2 })
		})
	})

	describe('.not modifier', () => {
		it('should work with .not for invalid hex strings', () => {
			;[...invalidHexStrings, ...nonStringTypes].forEach((hex) => {
				expect(hex).not.toBeHex()
			})
		})

		it('should work with .not for size mismatches', () => {
			invalidSizeCases.forEach(({ hex, expectedSize }) => {
				expect(hex).not.toBeHex({ size: expectedSize })
			})
		})

		it('should fail with .not for valid hex strings', () => {
			validHexStrings.forEach((hex) => {
				expect(() => expect(hex).not.toBeHex()).toThrow()
			})
		})

		it('should fail with .not for valid hex strings with correct size', () => {
			validHexStringsWithSize.forEach(({ hex, size }) => {
				expect(() => expect(hex).not.toBeHex({ size })).toThrow()
			})
		})
	})

	describe('error messages', () => {
		it('should provide helpful error messages for missing 0x prefix', () => {
			try {
				expect('1234').toBeHex()
			} catch (error: any) {
				expect(error.message).toBe('Expected 1234 to start with "0x"')
				expect(error.actual).toBe('1234')
			}
		})

		it('should provide helpful error messages for invalid hex characters', () => {
			try {
				expect('0xghij').toBeHex()
			} catch (error: any) {
				expect(error.message).toBe('Expected 0xghij to contain only hex characters (0-9, a-f, A-F) after "0x"')
				expect(error.actual).toBe('0xghij')
			}
		})

		it('should provide helpful error messages for wrong size', () => {
			try {
				expect('0x123').toBeHex({ size: 2 })
			} catch (error: any) {
				expect(error.message).toBe('Expected 0x123 to have 2 bytes, but got 1.5 bytes')
				expect(error.actual).toBe('0x123')
			}
		})

		it('should provide different messages for different error types', () => {
			const testCases = [
				{
					input: 'hello',
					expectedMessage: 'Expected hello to start with "0x"',
					actual: 'hello',
				},
				{
					input: '0xGHIJ',
					expectedMessage: 'Expected 0xGHIJ to contain only hex characters (0-9, a-f, A-F) after "0x"',
					actual: '0xGHIJ',
				},
				{
					input: '0x123',
					options: { size: 2 },
					expectedMessage: 'Expected 0x123 to have 2 bytes, but got 1.5 bytes',
					actual: '0x123',
				},
			]

			testCases.forEach(({ input, options, expectedMessage, actual }) => {
				try {
					expect(input).toBeHex(options)
				} catch (error: any) {
					expect(error.message).toBe(expectedMessage)
					expect(error.actual).toBe(actual)
				}
			})
		})
	})

	describe('real-world usage patterns', () => {
		it('should validate transaction hashes (32 bytes)', () => {
			const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
			expect(txHash).toBeHex({ size: 32 })
		})

		it('should validate block hashes (32 bytes)', () => {
			const blockHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
			expect(blockHash).toBeHex({ size: 32 })
		})

		it('should validate addresses as hex (20 bytes)', () => {
			const address = '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'
			expect(address).toBeHex({ size: 20 })
		})

		it('should validate short identifiers', () => {
			expect('0x1234').toBeHex({ size: 2 })
			expect('0xabcd').toBeHex({ size: 2 })
		})

		it('should validate function selectors (4 bytes)', () => {
			expect('0xa9059cbb').toBeHex({ size: 4 }) // transfer function selector
			expect('0x095ea7b3').toBeHex({ size: 4 }) // approve function selector
		})

		it('should validate empty hex', () => {
			expect('0x').toBeHex({ size: 0 })
			expect('0x').toBeHex() // should pass without size requirement
		})
	})
})
