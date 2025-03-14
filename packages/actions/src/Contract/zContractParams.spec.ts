import { expect, test } from 'vitest'
import type { ContractParams } from './ContractParams.js'
import { zContractParams } from './zContractParams.js'

test('zContractParams', () => {
	const contractParams = {
		abi: [
			{
				inputs: [],
				name: 'name',
				outputs: [
					{
						internalType: 'string',
						name: '',
						type: 'string',
					},
				],
				stateMutability: 'pure',
				type: 'function',
			},
		],
		blobVersionedHashes: ['0x0000000'] as `0x${string}`[],
		functionName: 'name',
		args: [],
		to: `0x${'0'.repeat(40)}`,
		throwOnFail: false,
	} as const satisfies ContractParams
	expect(zContractParams.parse(contractParams)).toEqual(contractParams)
	expect(() => zContractParams.parse('0x4')).toThrow()
})
