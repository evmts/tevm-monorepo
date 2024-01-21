import type { ContractParams } from '@tevm/actions-types'
import type { z } from 'zod'
import { zContractParams } from './zContractParams.js'
import { expect, test } from 'bun:test'

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
		blobVersionedHashes: ['0x0000000'],
		functionName: 'name',
		args: [],
		to: `0x${'0'.repeat(40)}`,
	} as const satisfies z.infer<typeof zContractParams> satisfies ContractParams
	expect(zContractParams.parse(contractParams)).toEqual(contractParams)
	expect(() => zContractParams.parse('0x4')).toThrow()
})
