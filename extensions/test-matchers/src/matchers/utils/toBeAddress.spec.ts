import { describe, expect, it } from 'vitest'

describe('toBeAddress', () => {
	const validAddressesWithCorrectChecksum = [
		'0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
		'0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
		'0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
		'0x0000000000000000000000000000000000000000',
		'0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
		'0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
		'0x000000000000000000000000000000000000dEaD',
	]

	const validAddressesWithInvalidChecksum = [
		'0xA5CC3C03994DB5B0D9A5EEDD10CABAB0813678AC',
		'0xA5CC3C03994DB5B0D9A5EEDD10CABAB0813678Ac',
		'0xFB6916095CA1DF60BB79CE92CE3EA74C37C5D359',
		'0xDE0B295669A9FD93D5F28D9EC85E40F4CB697BAE',
	]

	const invalidAddresses = [
		'0x123', // too short
		'0x', // empty
		'0x1234567890abcdef1234567890abcdef123456789', // too long
		'0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AG', // invalid hex char 'G'
		'0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', // invalid hex chars
		'0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678A!', // invalid char '!'
		'a5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', // missing 0x prefix
		'5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', // missing 0x prefix
		'invalid', // completely invalid
		123, // not string
		null,
		undefined,
		{},
		[],
		BigInt(123),
	]

	describe('valid addresses (strict: true)', () => {
		it('should pass for properly checksummed Ethereum addresses', () => {
			validAddressesWithCorrectChecksum.forEach((address) => {
				expect(address).toBeAddress({ strict: true })
				expect(address).toBeAddress() // strict: true is default
			})
		})

		it('should fail for addresses with incorrect checksum', () => {
			validAddressesWithInvalidChecksum.forEach((address) => {
				expect(() => expect(address).toBeAddress({ strict: true })).toThrow()
				expect(() => expect(address).toBeAddress()).toThrow()
			})
		})
	})

	describe('non-strict mode (strict: false)', () => {
		it('should pass for valid addresses regardless of checksum when strict: false', () => {
			validAddressesWithCorrectChecksum.forEach((address) => {
				expect(address).toBeAddress({ strict: false })
			})
			validAddressesWithInvalidChecksum.forEach((address) => {
				expect(address).toBeAddress({ strict: false })
			})
		})
	})

	describe('invalid addresses', () => {
		it('should fail for invalid addresses in all modes', () => {
			// Default mode (strict)
			invalidAddresses.forEach((address) => {
				expect(() => expect(address).toBeAddress()).toThrow()
			})
			// Explicit strict: true
			invalidAddresses.forEach((address) => {
				expect(() => expect(address).toBeAddress({ strict: true })).toThrow()
			})
			// Even with strict: false
			invalidAddresses.forEach((address) => {
				expect(() => expect(address).toBeAddress({ strict: false })).toThrow()
			})
		})

		describe('.not modifier', () => {
			it('should work with .not for invalid addresses', () => {
				invalidAddresses.forEach((address) => {
					expect(address).not.toBeAddress()
				})
			})

			it('should work with .not for checksum violations in strict mode', () => {
				validAddressesWithInvalidChecksum.forEach((address) => {
					expect(address).not.toBeAddress()
					expect(address).not.toBeAddress({ strict: true })
				})
			})

			it('should fail with .not for valid checksummed addresses', () => {
				validAddressesWithCorrectChecksum.forEach((address) => {
					expect(() => expect(address).not.toBeAddress()).toThrow()
				})
			})

			it('should fail with .not for valid addresses in non-strict mode', () => {
				;[...validAddressesWithCorrectChecksum, ...validAddressesWithInvalidChecksum].forEach((address) => {
					expect(() => expect(address).not.toBeAddress({ strict: false })).toThrow()
				})
			})
		})

		describe('error messages', () => {
			it('should provide helpful error messages for invalid format', () => {
				try {
					expect('0x123').toBeAddress()
				} catch (error: any) {
					expect(error.message).toBe('Expected 0x123 to be a valid Ethereum address (checksummed)')
					expect(error.actual).toBe('0x123')
				}

				try {
					expect(123).toBeAddress()
				} catch (error: any) {
					expect(error.message).toBe('Expected 123 to be a valid Ethereum address (checksummed)')
					expect(error.actual).toBe(123)
				}
			})

			it('should mention checksum in error messages when strict mode fails', () => {
				try {
					expect('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac').toBeAddress({ strict: true })
				} catch (error: any) {
					expect(error.message).toBe(
						'Expected 0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac to be a valid Ethereum address (checksummed)',
					)
					expect(error.actual).toBe('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac')
				}
			})

			it('should mention checksum in error messages for default mode (which is strict)', () => {
				try {
					expect('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac').toBeAddress()
				} catch (error: any) {
					expect(error.message).toBe(
						'Expected 0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac to be a valid Ethereum address (checksummed)',
					)
					expect(error.actual).toBe('0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac')
				}
			})

			it('should not mention checksum when strict: false', () => {
				try {
					expect('invalid').toBeAddress({ strict: false })
				} catch (error: any) {
					expect(error.message).toBe('Expected invalid to be a valid Ethereum address')
					expect(error.actual).toBe('invalid')
				}
			})
		})
	})
})
