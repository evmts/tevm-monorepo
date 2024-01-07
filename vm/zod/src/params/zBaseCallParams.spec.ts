import { zBaseCallParams } from './zBaseCallParams.js'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

test('zBaseCallParams', () => {
	const callParams = {
		blobVersionedHashes: ['0x0000000'],
		block: {
			number: 0x420n,
		},
		gasLimit: 0x420n,
		caller: `0x${'69'.repeat(20)}`,
	} as const satisfies z.infer<typeof zBaseCallParams>
	expect(zBaseCallParams.parse(callParams)).toEqual(callParams)
})
