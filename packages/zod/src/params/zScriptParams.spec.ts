import type { ScriptParams } from '@tevm/actions-types'
import type { z } from 'zod'
import { zScriptParams } from './zScriptParams.js'
import { expect, test } from 'bun:test'

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
