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

test('zBaseCallParams with addToMempool', () => {
	const callParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'latest',
		gas: 0x420n,
		gasPrice: 0x4420n,
		caller: `0x${'69'.repeat(20)}`,
		skipBalance: true,
		createTransaction: false,
		addToMempool: true,
		maxFeePerGas: 0x420n,
		maxPriorityFeePerGas: 0x420n,
	} as const satisfies z.infer<typeof zBaseCallParams>
	expect(zBaseCallParams.parse(callParams)).toEqual(callParams)
})

test('zBaseCallParams with addToBlockchain', () => {
	const callParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'latest',
		gas: 0x420n,
		gasPrice: 0x4420n,
		caller: `0x${'69'.repeat(20)}`,
		skipBalance: true,
		createTransaction: false,
		addToBlockchain: true,
		maxFeePerGas: 0x420n,
		maxPriorityFeePerGas: 0x420n,
	} as const satisfies z.infer<typeof zBaseCallParams>
	expect(zBaseCallParams.parse(callParams)).toEqual(callParams)
})

test('zBaseCallParams should not allow both addToMempool and addToBlockchain', () => {
	const callParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'latest',
		gas: 0x420n,
		gasPrice: 0x4420n,
		caller: `0x${'69'.repeat(20)}`,
		skipBalance: true,
		createTransaction: false,
		addToMempool: true,
		addToBlockchain: true,
		maxFeePerGas: 0x420n,
		maxPriorityFeePerGas: 0x420n,
	}
	expect(() => zBaseCallParams.parse(callParams)).toThrow(
		'Cannot set both addToMempool and addToBlockchain simultaneously. Use one or the other.',
	)
})
