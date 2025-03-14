import type { Hex } from 'viem'
import { expect, test } from 'vitest'
import { zBytecode } from './zBytecode.js'

test('zBytecode', () => {
	const bytecode = `0x${'69'.repeat(20)}` as const satisfies Hex
	expect(zBytecode.parse(bytecode)).toEqual(bytecode)
	expect(() => zBytecode.parse('0x4')).toThrow()
})
