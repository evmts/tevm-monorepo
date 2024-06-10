import { expect, test } from 'bun:test'
import type { Block } from '@tevm/actions'
import type { z } from 'zod'
import { zBlock } from './zBlock.js'

test('zBlock', () => {
	const block = {
		coinbase: `0x${'69'.repeat(20)}`,
		difficulty: 0x420n,
		gasLimit: 0x420n,
		number: 0x420n,
		timestamp: 0x420n,
		baseFeePerGas: 0x420n,
		blobGasPrice: 0x420n,
	} as const satisfies z.infer<typeof zBlock> satisfies Block
	expect(zBlock.parse(block)).toEqual(block)
})
