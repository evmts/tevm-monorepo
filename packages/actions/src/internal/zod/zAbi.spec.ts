import type { Abi } from 'abitype'
import { expect, test } from 'vitest'
import { zAbi } from './zAbi.js'

test('zAbi', () => {
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
		},
	] as const satisfies Abi
	expect(zAbi.parse(abi)).toEqual(abi)
})
