import type { CallParams } from '@tevm/actions-types'
import type { z } from 'zod'
import { zCallParams } from './zCallParams.js'
import { expect, test } from 'bun:test'

test('zCallParams', () => {
	const callParams: CallParams = {
		blobVersionedHashes: ['0x0000000'],
		block: {
			number: 0x420n,
		},
		data: '0x4242',
		gasLimit: 0x420n,
		caller: `0x${'69'.repeat(20)}`,
		deployedBytecode: `0x${'69'.repeat(32)}`,
	} as const satisfies z.infer<typeof zCallParams> satisfies CallParams
	expect(zCallParams.parse(callParams)).toEqual(callParams)
	expect(() => zCallParams.parse('0x4')).toThrow()
})
