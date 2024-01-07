import { zAccountParams } from './zAccountParams.js'
import type { AccountParams } from '@tevm/api'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

test('zAccountParams', () => {
	const accountParams = {
		address: `0x${'69'.repeat(20)}`,
		balance: 0x420n,
		deployedBytecode: `0x${'69'.repeat(32)}`,
		storageRoot: `0x${'69'.repeat(32)}`,
	} as const satisfies z.infer<typeof zAccountParams> satisfies AccountParams
	expect(zAccountParams.parse(accountParams)).toEqual(accountParams)
	const minimalAccountParams = {
		address: `0x${'69'.repeat(20)}`,
	} as const satisfies z.infer<typeof zAccountParams> satisfies AccountParams
	expect(zAccountParams.parse(minimalAccountParams)).toEqual(
		minimalAccountParams,
	)
})
