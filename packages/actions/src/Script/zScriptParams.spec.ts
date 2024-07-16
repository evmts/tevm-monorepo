import { expect, test } from 'vitest'
import type { z } from 'zod'
import type { ScriptParams } from './ScriptParams.js'
import { zScriptParams } from './zScriptParams.js'

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
