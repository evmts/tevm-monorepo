import type { Hex } from 'viem'
import { expect, test } from 'vitest'
import { zHex } from './zHex.js'

test('zHex', () => {
	const hex = '0x4205' as const satisfies Hex
	expect(zHex.parse(hex)).toEqual(hex)
	expect(() => zHex.parse('x4')).toThrow()
})
