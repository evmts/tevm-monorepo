import { expect, test } from 'vitest'
import type { z } from 'zod'
import { zBaseCallParams } from './zBaseCallParams.js'

test('zBaseCallParams', () => {
	const callParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'latest',
		gas: 0x420n,
		gasPrice: 0x4420n,
		caller: `0x${'69'.repeat(20)}`,
		skipBalance: true,
		createTransaction: false,
		maxFeePerGas: 0x420n,
		maxPriorityFeePerGas: 0x420n,
	} as const satisfies z.infer<typeof zBaseCallParams>
	expect(zBaseCallParams.parse(callParams)).toEqual(callParams)
})
