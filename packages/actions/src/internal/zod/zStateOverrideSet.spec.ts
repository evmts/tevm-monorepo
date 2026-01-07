import { describe, expect, it } from 'vitest'
import { zStateOverrideSet } from './zStateOverrideSet.js'

describe('zStateOverrideSet', () => {
	const validAddress = '0x1234567890123456789012345678901234567890'
	const validAddress2 = '0xabcdef1234567890abcdef1234567890abcdef12'

	describe('valid inputs', () => {
		it('should accept empty object', () => {
			const result = zStateOverrideSet.parse({})
			expect(result).toEqual({})
		})

		it('should accept balance override', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { balance: 1000000000000000000n },
			})
			expect(result).toEqual({
				[validAddress]: { balance: 1000000000000000000n },
			})
		})

		it('should accept nonce override', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { nonce: 5n },
			})
			expect(result).toEqual({
				[validAddress]: { nonce: 5n },
			})
		})

		it('should accept code override', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { code: '0x6080604052' },
			})
			expect(result).toEqual({
				[validAddress]: { code: '0x6080604052' },
			})
		})

		it('should accept state override', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: {
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000000':
							'0x0000000000000000000000000000000000000000000000000000000000000001',
					},
				},
			})
			expect(result).toEqual({
				[validAddress]: {
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000000':
							'0x0000000000000000000000000000000000000000000000000000000000000001',
					},
				},
			})
		})

		it('should accept stateDiff override', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: {
					stateDiff: {
						'0x0000000000000000000000000000000000000000000000000000000000000000':
							'0x0000000000000000000000000000000000000000000000000000000000000001',
					},
				},
			})
			expect(result).toEqual({
				[validAddress]: {
					stateDiff: {
						'0x0000000000000000000000000000000000000000000000000000000000000000':
							'0x0000000000000000000000000000000000000000000000000000000000000001',
					},
				},
			})
		})

		it('should accept multiple overrides for one address', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: {
					balance: 1000000000000000000n,
					nonce: 5n,
					code: '0x6080604052',
				},
			})
			expect(result).toEqual({
				[validAddress]: {
					balance: 1000000000000000000n,
					nonce: 5n,
					code: '0x6080604052',
				},
			})
		})

		it('should accept overrides for multiple addresses', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { balance: 1000n },
				[validAddress2]: { nonce: 10n },
			})
			expect(result).toEqual({
				[validAddress]: { balance: 1000n },
				[validAddress2]: { nonce: 10n },
			})
		})

		it('should accept zero balance', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { balance: 0n },
			})
			expect(result).toEqual({
				[validAddress]: { balance: 0n },
			})
		})

		it('should accept zero nonce', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { nonce: 0n },
			})
			expect(result).toEqual({
				[validAddress]: { nonce: 0n },
			})
		})

		it('should accept empty state object', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { state: {} },
			})
			expect(result).toEqual({
				[validAddress]: { state: {} },
			})
		})

		it('should accept empty stateDiff object', () => {
			const result = zStateOverrideSet.parse({
				[validAddress]: { stateDiff: {} },
			})
			expect(result).toEqual({
				[validAddress]: { stateDiff: {} },
			})
		})
	})

	describe('invalid inputs', () => {
		it('should reject invalid address key', () => {
			expect(() => zStateOverrideSet.parse({ 'not-an-address': { balance: 100n } })).toThrow()
		})

		it('should reject negative balance', () => {
			expect(() => zStateOverrideSet.parse({ [validAddress]: { balance: -1n } })).toThrow()
		})

		it('should reject negative nonce', () => {
			expect(() => zStateOverrideSet.parse({ [validAddress]: { nonce: -1n } })).toThrow()
		})

		it('should reject invalid code (not hex)', () => {
			expect(() => zStateOverrideSet.parse({ [validAddress]: { code: 'not-hex' } })).toThrow()
		})

		it('should reject invalid state key', () => {
			expect(() =>
				zStateOverrideSet.parse({
					[validAddress]: { state: { 'invalid-key': '0x01' } },
				}),
			).toThrow()
		})

		it('should reject invalid state value', () => {
			expect(() =>
				zStateOverrideSet.parse({
					[validAddress]: { state: { '0x01': 'invalid-value' } },
				}),
			).toThrow()
		})

		it('should reject unknown properties (strict object)', () => {
			expect(() =>
				zStateOverrideSet.parse({
					[validAddress]: { unknownProp: 'value' },
				}),
			).toThrow()
		})

		it('should reject null', () => {
			expect(() => zStateOverrideSet.parse(null)).toThrow()
		})

		it('should reject non-bigint balance', () => {
			expect(() => zStateOverrideSet.parse({ [validAddress]: { balance: 100 } })).toThrow()
		})

		it('should reject non-bigint nonce', () => {
			expect(() => zStateOverrideSet.parse({ [validAddress]: { nonce: 5 } })).toThrow()
		})
	})
})
