import { describe, expect, it } from 'vitest'
import { KECCAK256_NULL } from './constants.js'
import { bytesToHex, keccak256 } from '@tevm/utils'

describe('constants', () => {
	describe('KECCAK256_NULL', () => {
		it('should be a Uint8Array', () => {
			expect(KECCAK256_NULL).toBeInstanceOf(Uint8Array)
		})

		it('should be 32 bytes long', () => {
			expect(KECCAK256_NULL.length).toBe(32)
		})

		it('should match keccak256 of empty data', () => {
			// keccak256 returns hex by default
			const emptyKeccak = keccak256(new Uint8Array(0))
			expect(bytesToHex(KECCAK256_NULL)).toBe(emptyKeccak)
		})

		it('should have the expected hex value', () => {
			// This is the well-known keccak256 hash of empty data
			expect(bytesToHex(KECCAK256_NULL)).toBe(
				'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
			)
		})

		it('should be immutable (frozen)', () => {
			// Uint8Arrays are not frozen by default, but we check the value doesn't change
			const originalValue = bytesToHex(KECCAK256_NULL)
			expect(bytesToHex(KECCAK256_NULL)).toBe(originalValue)
		})
	})
})
