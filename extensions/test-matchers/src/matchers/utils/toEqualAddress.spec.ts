import type { Hex } from 'viem'
import { describe, expect, it } from 'vitest'

describe('toEqualAddress', () => {
	const validAddressPairs: [Hex, Hex][] = [
		// Same address - different cases
		['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'],
		['0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', '0x5AAEB6053F3E94C9B9A09F33669435E7EF1BEAED'],
		['0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'],
		// Zero address
		['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'],
		// Max address
		['0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF', '0xffffffffffffffffffffffffffffffffffffffff'],
	]

	const differentAddressPairs: [Hex, Hex][] = [
		['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'],
		['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000001'],
		['0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d35A'],
	]

	const invalidAddressPairs: [Hex | string, Hex | string][] = [
		['0x123', '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
		['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', '0x123'],
		['invalid', '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
		['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', 'invalid'],
	]

	it('should pass when comparing equal addresses', () => {
		validAddressPairs.forEach(([addr1, addr2]) => expect(addr1).toEqualAddress(addr2))
	})

	it('should fail when comparing different addresses', () => {
		differentAddressPairs.forEach(([addr1, addr2]) => expect(() => expect(addr1).toEqualAddress(addr2)).toThrow())
	})

	it('should fail when comparing invalid addresses', () => {
		invalidAddressPairs.forEach(([addr1, addr2]) => expect(() => expect(addr1).toEqualAddress(addr2)).toThrow())
	})

	it('should work with .not', () => {
		differentAddressPairs.forEach(([addr1, addr2]) => expect(addr1).not.toEqualAddress(addr2))
		validAddressPairs.forEach(([addr1, addr2]) => expect(() => expect(addr1).not.toEqualAddress(addr2)).toThrow())
	})

	it('should provide helpful error messages', () => {
		try {
			expect('0x123').toEqualAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
		} catch (error: any) {
			expect(error.message).toBe('Expected 0x123 to be a valid address')
			expect(error.actual).toBe('0x123')
			expect(error.expected).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
		}

		try {
			expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toEqualAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
		} catch (error: any) {
			expect(error.message).toBe('Expected addresses to be equal')
			expect(error.actual).toBe('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')
			expect(error.expected).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
		}
	})
})
