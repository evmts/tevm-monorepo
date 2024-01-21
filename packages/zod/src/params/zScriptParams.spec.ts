import { zScriptParams } from './zScriptParams.js'
import type { ScriptParams } from '@tevm/actions-types'
import { expect, test } from 'bun:test'
import type { z } from 'zod'

test('zScriptParams', () => {
	const scriptParams = {
		abi: [
			{
				inputs: [
					{
						internalType: 'string',
						name: '_name',
						type: 'string',
					},
				],
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
		deployedBytecode: `0x${'69'.repeat(32)}`,
		functionName: 'name',
		args: ['hello world'],
	} as const satisfies z.infer<typeof zScriptParams> satisfies ScriptParams
	expect(zScriptParams.parse(scriptParams)).toEqual(scriptParams)
})
