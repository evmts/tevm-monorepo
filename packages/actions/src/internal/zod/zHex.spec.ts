import type { Hex } from 'viem'
import { expect, test } from 'vitest'
import type { z } from 'zod'
import { zHex } from './zHex.js'

test('zHex', () => {
	const hex = '0x4205' as const satisfies z.infer<typeof zHex> satisfies Hex
	expect(zHex.parse(hex)).toEqual(hex)
	expect(() => zHex.parse('x4')).toThrow()
})
