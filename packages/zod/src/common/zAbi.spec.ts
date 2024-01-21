import { zAbi } from './zAbi.js'
import type { Abi } from 'abitype'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

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
	] as const satisfies z.infer<typeof zAbi> satisfies Abi
	expect(zAbi.parse(abi)).toEqual(abi)
})
