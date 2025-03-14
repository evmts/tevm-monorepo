import { expect, test } from 'vitest'
import type { Block } from '../../common/Block.js'
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
	} as const satisfies Block
	expect(zBlock.parse(block)).toEqual(block)
})
