import { zSetAccountParams } from './zSetAccountParams.js'
import type { SetAccountParams } from '@tevm/actions-types'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

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

test('zSetAccountParams works for 0', () => {
	const accountParams = {
		address: `0x${'69'.repeat(20)}`,
		balance: 0x0n,
		deployedBytecode: `0x${'69'.repeat(32)}`,
		storageRoot: `0x${'69'.repeat(32)}`,
		throwOnFail: true,
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
