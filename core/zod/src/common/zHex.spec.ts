import { zHex } from './zHex.js'
import { expect, test } from 'bun:test'
import type { Hex } from 'viem'
import type { z } from 'zod'

test('zHex', () => {
	const hex = '0x4205' as const satisfies z.infer<typeof zHex> satisfies Hex
	expect(zHex.parse(hex)).toEqual(hex)
	expect(() => zHex.parse('x4')).toThrow()
})
