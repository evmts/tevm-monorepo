import { defineCall } from './defineCall.js'
import { definePrecompile } from './definePrecompile.js'
import fs from 'fs/promises'
import { Fs } from './Fs.sol'

export const fsPrecompile = definePrecompile({
	contract: Fs,
	address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2',
	call: defineCall(Fs.abi, {
		readFile: async ({ args }) => {
			return {
				returnValue: await fs.readFile(...args, 'utf8'),
				executionGasUsed: 0n,
			}
		},
		writeFile: async ({ args }) => {
			await fs.writeFile(...args)
			return { returnValue: true, executionGasUsed: 0n }
		},
	}),
})
