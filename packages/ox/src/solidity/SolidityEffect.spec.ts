import * as SolidityOriginal from 'ox/core/Solidity'
import { describe, expect, it } from 'vitest'
import * as SolidityEffect from './SolidityEffect.js'

describe('SolidityEffect', () => {
	describe('constants', () => {
		it('should re-export all constants from the original Solidity module', () => {
			// Check a sample of constants to ensure they match
			expect(SolidityEffect.arrayRegex).toBe(SolidityOriginal.arrayRegex)
			expect(SolidityEffect.bytesRegex).toBe(SolidityOriginal.bytesRegex)
			expect(SolidityEffect.integerRegex).toBe(SolidityOriginal.integerRegex)

			// Check min/max values
			expect(SolidityEffect.maxInt256).toBe(SolidityOriginal.maxInt256)
			expect(SolidityEffect.minInt256).toBe(SolidityOriginal.minInt256)
			expect(SolidityEffect.maxUint256).toBe(SolidityOriginal.maxUint256)

			// Check some other values
			expect(SolidityEffect.maxInt8).toBe(SolidityOriginal.maxInt8)
			expect(SolidityEffect.minInt8).toBe(SolidityOriginal.minInt8)
			expect(SolidityEffect.maxUint8).toBe(SolidityOriginal.maxUint8)
		})
	})
})
