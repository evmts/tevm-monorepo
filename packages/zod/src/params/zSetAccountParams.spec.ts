import type { SetAccountParams } from '@tevm/actions-types'
import type { z } from 'zod'
import { zSetAccountParams } from './zSetAccountParams.js'
import { expect, test } from 'bun:test'

test('zSetAccountParams', () => {
	const accountParams = {
		address: `0x${'69'.repeat(20)}`,
		balance: 0x420n,
		deployedBytecode: `0x${'69'.repeat(32)}`,
		storageRoot: `0x${'69'.repeat(32)}`,
	} as const satisfies z.infer<
		typeof zSetAccountParams
	> satisfies SetAccountParams
	expect(zSetAccountParams.parse(accountParams)).toEqual(accountParams)
	const minimalSetAccountParams = {
		address: `0x${'69'.repeat(20)}`,
	} as const satisfies z.infer<
		typeof zSetAccountParams
	> satisfies SetAccountParams
	expect(zSetAccountParams.parse(minimalSetAccountParams)).toEqual(
		minimalSetAccountParams,
	)
})