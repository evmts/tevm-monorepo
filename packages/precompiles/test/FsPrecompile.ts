import { defineCall, definePrecompile } from '../src/index.js'
import { Fs } from './Fs.sol'
import fs from 'fs/promises'
const contract = Fs.withAddress('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2')
export const fsPrecompile = definePrecompile({
	contract,
	call: defineCall(Fs.abi, {
		readFile: async ({ args }) => {
			return {
				returnValue: await fs.readFile(...args, 'utf8'),
				executionGasUsed: 0n,
			}
		},
		writeFile: async ({ args }) => {
			await fs.writeFile(...args)
			console.log('success!', args)
			return { returnValue: true, executionGasUsed: 0n }
		},
	}),
})
