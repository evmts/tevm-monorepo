import type { Hex } from '@tevm/utils'
import { describe, expect, test } from 'vitest'
import type { z } from 'zod'
import { zHex } from './zHex.js'

describe('zHex', () => {
	test('should validate a valid hex string', () => {
		const hex = '0x4205' as const satisfies z.infer<typeof zHex> satisfies Hex
		expect(zHex.parse(hex)).toEqual(hex)
	})

	test('should accept an empty hex string', () => {
		const emptyHex = '0x' as const satisfies z.infer<typeof zHex> satisfies Hex
		expect(zHex.parse(emptyHex)).toEqual(emptyHex)
	})

	test('should reject strings without 0x prefix', () => {
		expect(() => zHex.parse('4205')).toThrow()
		expect(() => zHex.parse('x4')).toThrow()
	})

	test('should reject non-hex characters', () => {
		expect(() => zHex.parse('0xg123')).toThrow() // 'g' is not a hex character
		expect(() => zHex.parse('0xZ123')).toThrow() // 'Z' is not a hex character
	})
})
