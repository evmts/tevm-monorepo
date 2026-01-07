import type { Hex } from '@tevm/utils'
import { expect, test } from 'vitest'
import type { z } from 'zod'
import { zBytecode } from './zBytecode.js'

test('zBytecode', () => {
	const bytecode = `0x${'69'.repeat(20)}` as const satisfies z.infer<typeof zBytecode> satisfies Hex
	expect(zBytecode.parse(bytecode)).toEqual(bytecode)
	expect(() => zBytecode.parse('0x4')).toThrow()
})
