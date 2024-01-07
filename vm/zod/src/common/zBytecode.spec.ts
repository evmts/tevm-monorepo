import { zBytecode } from './zBytecode.js'
import { expect, test } from 'bun:test'
import type { Hex } from 'viem'
import type { z } from 'zod'

test('zBytecode', () => {
	const bytecode = `0x${'69'.repeat(20)}` as const satisfies z.infer<
		typeof zBytecode
	> satisfies Hex
	expect(zBytecode.parse(bytecode)).toEqual(bytecode)
	expect(() => zBytecode.parse('0x4')).toThrow()
})
