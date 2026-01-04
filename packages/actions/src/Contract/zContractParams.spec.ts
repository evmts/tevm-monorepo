import type { AbiFunction } from '@tevm/utils'
import { expect, test } from 'vitest'
import { zContractParams } from './zContractParams.js'

test('zContractParams', () => {
	const abi = [
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
		} as AbiFunction,
	]

	const contractParams = {
		abi,
		blobVersionedHashes: ['0x0000000'],
		functionName: 'name',
		args: [],
		to: `0x${'0'.repeat(40)}`,
		throwOnFail: false,
	}
	expect(zContractParams.parse(contractParams)).toEqual(contractParams)
	expect(() => zContractParams.parse('0x4')).toThrow()
})
