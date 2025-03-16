import { expect, test } from 'vitest'
import type { BaseCallParams } from './BaseCallParams.js'
import { zBaseCallParams } from './zBaseCallParams.js'

test('zBaseCallParams', () => {
	const callParams: BaseCallParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'latest',
		gas: 0x420n,
		gasPrice: 0x4420n,
		caller: `0x${'69'.repeat(20)}`,
		skipBalance: true,
		createTransaction: false,
		maxFeePerGas: 0x420n,
		maxPriorityFeePerGas: 0x420n,
	}
	expect(zBaseCallParams.parse(callParams)).toEqual(callParams)
})
